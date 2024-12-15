import { View, StyleSheet, useWindowDimensions } from 'react-native';
import DraggingOrder from './DraggingOrder';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

type DraggingContext = {
  draggingTaskId: number;
  setDraggingTask: (id: number, y: number) => void;
  dragY: SharedValue<number>; // DragY não é mais opcional
  dragOffsetY: SharedValue<number>; // DragOffsetY não é mais opcional
};

const DraggingContext = createContext<DraggingContext>({
  setDraggingTask: () => {},
  draggingTaskId: 0,
  dragY: useSharedValue(0), // Valor padrão para dragY
  dragOffsetY: useSharedValue(0), // Valor padrão para dragOffsetY
});

const OrderDragArea = ({
  children,
  updateItemPosition,
}: PropsWithChildren<{
  updateItemPosition: (id: number, y: number) => void;
}>) => {
  const [draggingTaskId, setDraggingTaskId] = useState<number>(0);
  const { width } = useWindowDimensions();

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0); // Inicializado fora da renderização condicional
  const dragOffsetY = useSharedValue(0); // Inicializando com 0

  const drop = () => {
    updateItemPosition(draggingTaskId, dragY.value);
    setDraggingTaskId(0);
  };

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      if (draggingTaskId) {
        stateManager.activate();
      }
    })
    .onChange((event) => {
      dragX.value = dragX.value + event.changeX;
      dragY.value = dragY.value + event.changeY;
    })
    .onEnd(() => {
      console.log('Dropped');
      runOnJS(drop)();
    })
    .onFinalize(() => {
      runOnJS(setDraggingTaskId)(0);
    });

  const setDraggingTask = (id: number, y: number) => {
    setDraggingTaskId(id);
    dragY.value = y;
    dragX.value = 20;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: dragY.value - dragOffsetY.value,
      left: dragX.value,
    };
  });

  return (
    <DraggingContext.Provider
      value={{
        setDraggingTask,
        dragY, // Agora sempre presente
        draggingTaskId,
        dragOffsetY, // Sempre presente
      }}
    >
      <GestureDetector gesture={pan}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        >
          {children}

          <Animated.View
            style={[
              animatedStyle,
              {
                width: width - 40,
                position: 'absolute',
                transform: [
                  {
                    rotateZ: '3deg',
                  },
                ],
              },
            ]}
          >
            {draggingTaskId && <DraggingOrder id={draggingTaskId} />}
          </Animated.View>
        </View>
      </GestureDetector>
    </DraggingContext.Provider>
  );
};

export default OrderDragArea;

export const useDraggingContext = () => useContext(DraggingContext);
