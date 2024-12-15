import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderDatabase, useOrderDatabase } from '../database/useOrderDatabase'; // Ajuste conforme a sua implementação

export default function DraggingOrder({ id }: { id: number }) {
  const [order, setOrder] = useState<OrderDatabase | null>(null); // Estado para armazenar a ordem
  const orderDatabase = useOrderDatabase(); // Acesso ao banco de dados

  // Função para buscar a ordem pelo id
  const fetchOrder = async () => {
    try {
      const fetchedOrder = await orderDatabase.getOrderById(id); // Supondo que você tenha uma função para buscar por id
      setOrder(fetchedOrder);
    } catch (error) {
      console.log('Error fetching order:', error);
    }
  };

  // Chama fetchOrder quando o componente for montado
  useEffect(() => {
    fetchOrder();
  }, [id]); // Dependência do id, para atualizar se o id mudar

  // Caso a ordem ainda não tenha sido carregada
  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {order.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1D2125',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,

    shadowColor: '#8da6b5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
