import { FiEdit3, FiTrash } from 'react-icons/fi';
import { Container } from './styles';
import api from '../../services/api';
import {useState} from 'react';

interface FoodProps {
  key: number;
  food: object;
  handleDelete: () => void;
  handleEditFood: () => void;
}

export function Food({key, food, handleDelete, handleEditFood}:FoodProps) {
  const [available, setAvailable] = useState();
  return (
    
  )
}