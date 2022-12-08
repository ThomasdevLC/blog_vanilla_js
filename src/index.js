import { async } from "regenerator-runtime";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");

const createArticle = (articles) => {
  const articlesDom = articles.map((article) => {
    const articleDom = document.createElement("div");
    articleDom.classList.add("article");
    articleDom.innerHTML = `
        <img
        src="${article.img}"
        alt="profile"
      />
      <h2>${article.title}</h2>
      <p class="article-author">${article.author} - ${article.category}</p>
      <p class="article-content">
      ${article.content}
      </p>
      <div class="article-actions">
              <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
            </div>  
      
      `;
    return articleDom;
  });

  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articlesDom);
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const target = event.target;
        const articleId = target.dataset.id;
        const response = await fetch(
          `https://restapi.fr/api/article/${articleId}`,
          { method: "DELETE" }
        );
        const body = await response.json();
        fetchArticle();
        console.log(body);
      } catch (err) {
        console.log("error :", err);
      }
    });
  });
};

const fetchArticle = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/article");
    const articles = await response.json();
    console.log(articles);
    createArticle(articles);
  } catch (err) {
    console.log("error :", err);
  }
};

fetchArticle();
