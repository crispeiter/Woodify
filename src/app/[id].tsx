import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { OrderDatabase, useOrderDatabase } from '../database/useOrderDatabase'; // Supondo que você tenha um hook para interação com o SQLite

const OrderDetails = () => {
  const { id } = useLocalSearchParams();
  const orderDatabase = useOrderDatabase(); // Seu hook para manipular o SQLite

  const [updatedDescription, setUpdatedDescription] = useState<string>(''); // Estado para armazenar a descrição atualizada
  const [order, setOrder] = useState<OrderDatabase | null>(null); // Estado para armazenar a tarefa buscada

  // Função para buscar a ordem pelo ID
  const fetchOrder = async () => {
    try {
      const fetchedOrder = await orderDatabase.getOrderById(Number(id)); // Certifique-se de que o id seja numérico
      setOrder(fetchedOrder);
      setUpdatedDescription(fetchedOrder?.description || ''); // Preenche o campo de descrição com o valor atual
    } catch (error) {
      console.log('Erro ao buscar a tarefa:', error);
    }
  };

  // Função para atualizar a descrição no banco de dados
  const updateDescription = async () => {
    console.log('1');
    if (order) {
      console.log('2');
      try {
        // Atualiza o objeto 'prder' com a nova descrição
        await orderDatabase.update({ ...order, description: updatedDescription });
        setOrder({ ...order, description: updatedDescription }); // Atualiza a tarefa no estado local
      } catch (error) {
        console.log('Erro ao atualizar a descrição:', error);
      }
    }
  };

  const finalizeOrder = async () => {
    if (order) {
      try {
        await orderDatabase.update({ ...order, isComplete: 1 });
        setOrder({ ...order, isComplete: 1 });
      } catch (error) {
        console.log('Erro ao finalizar o pedido:', error);
      }
    }
  };

  // Chama a função fetchOrder quando o componente for montado
  useEffect(() => {
    fetchOrder();
  }, [id]); // O id é a dependência para garantir que a tarefa seja buscada ao iniciar o componente

  if (!order) {
    return <Text style={styles.text}>Tarefa não encontrada</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Detalhes do Pedido' }} />

      <TextInput
        value={updatedDescription}
        onChangeText={setUpdatedDescription}
        onEndEditing={updateDescription} // Atualiza ao terminar a edição
        style={styles.input}
        multiline={true}
        autoCorrect={false}
        // numberOfLines={5}
      />
      {/* <Button title="Salvar" onPress={updateDescription} /> */}
      <Button title="Salvar" onPress={() => {
          updateDescription();
          console.log('foi');
        }} />
      {/* <Button title="Finalizar Pedido" onPress={finalizeOrder} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#101112',
    flex: 1,
  },
  input: {
    color: 'white',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#1D2125',
    borderRadius: 5,
    height: 'auto',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default OrderDetails;
