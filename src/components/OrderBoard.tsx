import { View, StyleSheet } from 'react-native';
import OrderList from './OrderList';
import { LinearGradient } from 'expo-linear-gradient';
import OrderDragArea from './OrderDragArea';
import { ItemHeight } from './OrderListItem';
import { useState, useEffect } from 'react';
import { OrderDatabase, useOrderDatabase } from '../database/useOrderDatabase';

export default function OrderBoard() {
  const [orders, setOrders] = useState<OrderDatabase[]>([]); // Estado que contém a lista de ordens
  const orderDatabase = useOrderDatabase();

  // Função para atualizar a posição do item
  const updateItemPosition = async (itemId: number, y: number) => {
    const newPosition = Math.max(1, Math.ceil((y - 73) / ItemHeight));
    const updatedOrders = [...orders];
    const fromIndex = updatedOrders.findIndex(order => order.id === itemId);

    if (fromIndex !== -1) {
      const [movedItem] = updatedOrders.splice(fromIndex, 1);
      updatedOrders.splice(newPosition - 1, 0, movedItem);

      // Atualiza as posições no banco de dados
      for (let i = 0; i < updatedOrders.length; i++) {
        const task = updatedOrders[i];
        await orderDatabase.update(task);
      }

      setOrders(updatedOrders); // Atualiza o estado da lista
    }
  };

  // Função para carregar as ordens
  const listOrders = async () => {
    try {
      const ordersFromDB = await orderDatabase.getActiveOrders();
      setOrders(ordersFromDB); // Atualiza o estado com os dados recuperados
    } catch (error) {
      console.log(error);
    }
  };

  // Função para criar uma nova ordem
  const createOrder = async (newOrder: string) => {
    try {
      if(newOrder) {
        const maxPosition = await orderDatabase.getMaxPosition() || 0;
        await orderDatabase.create({ description: newOrder, position: maxPosition + 1 });
        listOrders(); // Atualiza a lista após a criação
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Função para excluir uma ordem
  const deleteOrder = async (id: number) => {
    try {
      await orderDatabase.remove(id);
      listOrders(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.log(error);
    }
  };

  // Chama listOrders quando o componente for montado
  useEffect(() => {
    listOrders();
  }, []);

  return (
    <OrderDragArea updateItemPosition={updateItemPosition}>
      <View style={{ padding: 10, flex: 1 }}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#8711c1', '#2472fc']}
          style={StyleSheet.absoluteFill}
        />

        <OrderList
          orders={orders} // Passa as ordens para TaskList como prop
          createOrder={createOrder} // Passa a função de criar ordem
          deleteOrder={deleteOrder} // Passa a função de excluir ordem
        />
      </View>
    </OrderDragArea>
  );
}
