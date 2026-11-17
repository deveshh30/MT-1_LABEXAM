const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

let foods = [
  { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
  { id: 2, foodName: 'Burger', category: 'Fast Food', price: 180, availability: true },
  { id: 3, foodName: 'Salad', category: 'Healthy', price: 140, availability: false },
];

function validateFood(data) {
  return (
    data &&
    typeof data.foodName === 'string' && data.foodName.trim() !== '' &&
    typeof data.category === 'string' && data.category.trim() !== '' &&
    typeof data.price === 'number' && data.price > 0 &&
    typeof data.availability === 'boolean'
  );
}

app.get('/foods', (req, res) => {
  res.status(200).json(foods);
});

app.get('/foods/:id', (req, res) => {
  const id = Number(req.params.id);
  const food = foods.find((item) => item.id === id);

  if (!food) {
    return res.status(404).json({ message: 'Food item not found.' });
  }

  return res.status(200).json(food);
});

app.post('/foods', (req, res) => {
  const foodData = req.body;

  if (!validateFood(foodData) || !Number.isInteger(foodData.id)) {
    return res.status(400).json({ message: 'Missing required fields or invalid price.' });
  }

  const exists = foods.some((food) => food.id === foodData.id);
  if (exists) {
    return res.status(400).json({ message: 'Food ID already exists.' });
  }

  foods.push(foodData);
  return res.status(201).json({ message: 'Food item created successfully.', food: foodData });
});

app.put('/foods/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = foods.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Food item not found.' });
  }

  const updatedData = { ...foods[index], ...req.body };

  if (!validateFood(updatedData)) {
    return res.status(400).json({ message: 'Missing required fields or invalid price.' });
  }

  foods[index] = updatedData;
  return res.status(200).json({ message: 'Food item updated successfully.', food: foods[index] });
});

app.delete('/foods/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = foods.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Food item not found.' });
  }

  const [deletedFood] = foods.splice(index, 1);
  return res.status(200).json({ message: 'Food item deleted successfully.', food: deletedFood });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
