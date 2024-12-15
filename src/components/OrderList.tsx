import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import OrderListItem from './OrderListItem';
import { useState } from 'react';
import { OrderDatabase } from '../database/useOrderDatabase';
import { useDraggingContext } from './OrderDragArea';

export default function OrderList({
  orders, // Recebe as ordens de TaskBoard como prop
  createOrder, // Recebe a função de criação de ordem
  deleteOrder, // Recebe a função de exclusão de ordem
}: {
  orders: OrderDatabase[];
  createOrder: (newOrder: string) => void;
  deleteOrder: (id: number) => void;
}) {
  const [newOrder, setNewOrder] = useState(''); // Estado para armazenar a descrição da nova ordem
  const { dragOffsetY } = useDraggingContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>

      {/* A lista de tarefas */}
      <FlatList
        onScroll={(event) =>
          (dragOffsetY.value = event.nativeEvent.contentOffset.y) // Atualiza o dragOffsetY no contexto
        }
        data={orders} // Passa as ordens para o FlatList
        renderItem={({ item, index }) => (
          <OrderListItem 
            order={item} 
            index={index} 
            deleteOrder={deleteOrder} // Passa a função de excluir para cada item
          />
        )}
        keyExtractor={(item) => item.id.toString()} // Garantir que a chave seja única
      />

      {/* Campo de entrada para nova tarefa */}
      <TextInput
        value={newOrder}
        onChangeText={setNewOrder}
        placeholder="Novo pedido"
        placeholderTextColor="gray"
        style={styles.input}
        multiline={true}
        autoCorrect={false}
        numberOfLines={5}
      />
      <Button title="Adicionar pedido" onPress={() => {
          createOrder(newOrder);
          setNewOrder('');
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101112',
    padding: 10,
    borderRadius: 5,
    gap: 5,
    flex: 1,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    color: 'white',
    padding: 15,
    backgroundColor: '#1D2125',
    borderRadius: 5,
  },
});
