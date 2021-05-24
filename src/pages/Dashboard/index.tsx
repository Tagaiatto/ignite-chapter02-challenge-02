import {useEffect, useState} from 'react';
import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodType {
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
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  
  useEffect(() => {
    try {
      api.get('/foods')
      .then(response => setFoods(response.data))
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function handleAddFood(food: FoodType) {
    const response = await api.post('/foods', {
      ...food,
      available: true,
    });

    setFoods([...foods, response.data]);
  }

  async function handleUpdateFood(food: FoodType) {
    // const foodToUpdate = foods.filter((f) => f.id === food.id);

    try {
      const foodUpdated = await api.put(
      `/foods/${food.id}`,
      {...editingFood, ...food},
      );

      const foodsUpdated = foods.map(f => 
        f.id !== foodUpdated.data.id ? f : foodUpdated.data   
      );
      
      setFoods([...foodsUpdated]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    try{
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);
      setFoods(foodsFiltered);
    } catch(err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food);
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
                handleDeleteFood={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  );
}
