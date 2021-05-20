import {useEffect, useState} from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

// {
//   "id": 1,
//   "name": "Ao molho",
//   "description": "Macarrão ao molho branco, fughi e cheiro verde das montanhas",
//   "price": "19.90",
//   "available": true,
//   "image": "https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-food/food1.png"
// },
export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  
  useEffect(() => {
    api.get('/foods')
    .then(response => setFoods(response.data))

  }, []);

  async function handleAddFood(food: FoodProps) {
    const response = await api.post('/foods', {
      ...food,
      available: true,
    });

    setFoods([...foods, response.data]);
  }

  async function handleUpdateFood(food: FoodProps) {
    const foodToUpdate = foods.filter((f) => f.id === food.id);

    const foodUpdated = await api.put(
      `/foods/${food.id}`,
      {...foodToUpdate, ...food},
    );

    const foodsUpdated = foods.map(f => 
      f.id !== foodUpdated.data.id ? f : foodUpdated.data   
    );
    
    setFoods([...foodsUpdated]);
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods([...foodsFiltered]);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodProps) {
    //Aqui era passado uma food para o editingFood
    setEditModalOpen(true);
  }


  return (
    <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  );
}
