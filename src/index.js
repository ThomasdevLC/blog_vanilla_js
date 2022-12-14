import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");

const createArticles = (articles) => {
  const createArticleDOM = (article) => {
    const articleDOM = document.createElement("div");
    articleDOM.classList.add("article");
    articleDOM.innerHTML = `
	<img
		src="${article.img}"
		alt="profile"
	/>
	<h2>${article.title}</h2>
	<p class="article-author">${article.author} - ${new Date(
      article.createdAt
    ).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}</p>
	<p class="article-content">
		${article.content}
	</p>
	<div class="article-actions">
		<button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
		<button class="btn btn-primary" data-id=${article._id}>Modifier</button>
	</div>
`;
    return articleDOM;
  };
  const articlesDOM = Array.isArray(articles)
    ? articles.map((article) => createArticleDOM(article))
    : articles
    ? [createArticleDOM(articles)]
    : [];

  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articlesDOM);
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");
  const editButtons = articleContainerElement.querySelectorAll(".btn-primary");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.target;
      const articleId = target.dataset.id;
      location.assign(`/form.html?id=${articleId}`);
    });
  });
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const target = event.target;
        const articleId = target.dataset.id;
        const response = await fetch(
          `https://restapi.fr/api/article/${articleId}`,
          {
            method: "DELETE",
          }
        );
        const body = await response.json();
        console.log(body);
        fetchArticle();
      } catch (e) {
        console.log("e : ", e);
      }
    });
  });
};

const displayMenuCategories = (categoriesArr) => {
  const liElements = categoriesArr.map((categoryElem) => {
    const li = document.createElement("li");
    li.innerHTML = `<li>${categoryElem[0]} (<strong>${categoryElem[1]}</strong>)<li>`;
    return li;
  });
  categoriesContainerElement.innerHTML = "";
  categoriesContainerElement.append(...liElements);
};

const createMenuCategories = (articles) => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArr = Object.keys(categories).map((category) => {
    return [category, categories[category]];
  });
  console.log(categoriesArr);
  displayMenuCategories(categoriesArr);
};

const fetchArticle = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/article");
    const articles = await response.json();
    createArticles(articles);
    createMenuCategories(articles);
    console.log("response : ", articles);
  } catch (e) {
    console.log("e : ", e);
  }
};

fetchArticle();
