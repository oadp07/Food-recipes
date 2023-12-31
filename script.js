const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealEl = document.getElementById('meals');
const resultHeading = document.getElementsByClassName('result-heading');
const single_mealEl = document.getElementById('single-meal');

function searchMeal(e) {
    e.preventDefault();

    single_mealEl.innerHTML = "";

    const term = search.value.trim();

    if (term) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search Result For ${term}</h2>`;
                if (!data.meals) {
                    resultHeading.innerHTML = `<h2>There Are No Results For ${term}</h2>`;
                } else {
                    mealEl.innerHTML = data.meals
                        .map(
                            (meal) => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info" data-mealid="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                        `
                        )
                        .join("");
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }
}

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

function addMealToDOM(meal) {
    const ingredients = [];
for (let i = 1; i <= 20; i++) {
  if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;
}

submit.addEventListener("submit", searchMeal);

// mealEl.addEventListener('click', (e) => {
//     const mealInfo = e.path.find(item => {
//         if (item.classList) {
//             return item.classList.contains("meal-info");
//          } else {
//             return false;
//         }
//     });
//     if (mealInfo) {
//         const mealID = mealInfo.getAttribute("data-mealid");
//         getMealById(mealID);
//     }
// });

mealEl.addEventListener('click', (e) => {
    const mealInfo = e.target.closest('.meal-info');

    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealid");
        getMealById(mealID);
    }
});







