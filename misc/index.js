const userRoles = {
  admin: "ADMIN",
  user: "USER",
};

const PRODUCT_CATEGORIES = [
  "dairy",
  "preserved food",
  "fish & seafood",
  "meat",
  "fats & oils",
  "dried fruit",
  "cereal products",
  "fruits",
  "vegetables",
];

const MEAL_CATEGORIES = [
  "I breakfast",
  "II breakfast",
  "lunch",
  "snack",
  "I dinner",
  "II dinner",
];

const NUTRIENT_DIVISOR = 100;

const sumNutrients = (products) => ({
  proteins: products
    .map(
      (prod) =>
        (prod.product.nutrients.proteins * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  carbohydrates: products
    .map(
      (prod) =>
        (prod.product.nutrients.carbohydrates * prod.quantity) /
        NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  fat: products
    .map(
      (prod) => (prod.product.nutrients.fat * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  saturatedFat: products
    .map(
      (prod) =>
        (prod.product.nutrients.saturatedFat * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  omega3: products
    .map(
      (prod) =>
        (prod.product.nutrients.omega3 * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  omega6: products
    .map(
      (prod) =>
        (prod.product.nutrients.omega6 * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  salt: products
    .map(
      (prod) => (prod.product.nutrients.salt * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  sugar: products
    .map(
      (prod) =>
        (prod.product.nutrients.sugar * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
  energy: products
    .map(
      (prod) =>
        (prod.product.nutrients.energy * prod.quantity) / NUTRIENT_DIVISOR
    )
    .reduce((pVal, cVal) => pVal + cVal),
});

exports.userRoles = userRoles;
exports.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
exports.MEAL_CATEGORIES = MEAL_CATEGORIES;
exports.sumNutrients = sumNutrients;
