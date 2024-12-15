import { Text, StyleSheet, Pressable, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useDraggingContext } from './OrderDragArea';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { OrderDatabase } from '../database/useOrderDatabase';

export const ItemHeight = 60;

export default function OrderListItem({
  order,
  index,
  deleteOrder, // Recebe a função deleteOrder como prop
}: {
  order: OrderDatabase;
  index: number;
  deleteOrder: (id: number) => void; // Tipagem para a função deleteOrder
}) {
  const { setDraggingTask, dragY, draggingTaskId, dragOffsetY } = useDraggingContext();

  const marginTop = useSharedValue(0);

  useAnimatedReaction(
    () => dragY?.value,
    (newDragY) => {
      if (!newDragY) {
        marginTop.value = 0;
      }
      const itemY = index * ItemHeight + 73 - dragOffsetY.value;

      // Se está acima do primeiro item
      if (index === 0 && newDragY < itemY + ItemHeight) {
        marginTop.value = withTiming(ItemHeight);
      }

      // Se está em cima do item atual
      marginTop.value = withTiming(
        newDragY >= itemY && newDragY < itemY + ItemHeight ? ItemHeight : 0
      );
    }
  );

  useEffect(() => {
    const itemY = index * ItemHeight + 73;
    if (draggingTaskId) {
      marginTop.value =
        dragY.value >= itemY && dragY.value < itemY + ItemHeight
          ? ItemHeight
          : 0;
    } else {
      marginTop.value = 0;
    }
  }, [draggingTaskId]);

  // Função de exclusão chamada ao clicar no ícone de exclusão
  const handleDeleteOrder = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza que deseja apagar este pedido?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => deleteOrder(order.id), // Chama a função de exclusão apenas se o usuário confirmar
        },
      ]
    );
  };

  if (draggingTaskId?.toString() === order.id.toString()) {
    return <Animated.View style={{ marginTop }} />;
  }

  return (
    <Animated.View style={[styles.root, { marginTop: marginTop }]}>
      <Link href={`/${order.id}`} asChild>
        <Pressable
          style={styles.container}
          onLongPress={() => setDraggingTask(order.id, index * ItemHeight + 73)}
        >
          <Text style={styles.text}>
            {order.description}
          </Text>

          {/* Ícone de exclusão chamando handleDeleteOrder */}
          <AntDesign onPress={handleDeleteOrder} name="close" size={32} color="gray" />
        </Pressable>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 3,
  },
  container: {
    backgroundColor: '#1D2125',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
