import { useSQLiteContext } from "expo-sqlite"

export type OrderDatabase = {
    id: number
    description: string
    isComplete: number
    createdAt: Date
    position: number
}

export function useOrderDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<OrderDatabase, "id" | "isComplete" | "createdAt">) {
        const statement = await database.prepareAsync(
            "INSERT INTO orders (description, position) VALUES ($description, $position)"
        );

        try {
            const result = await statement.executeAsync({
                $description: data.description,
                $position: data.position,
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString();

            return { insertedRowId }
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getMaxPosition() {
        try {
            const query = "SELECT MAX(position) AS max_position FROM orders";

            const response = await database.getFirstAsync(query) as { max_position: number };
            return response.max_position;
        } catch (error) {
            throw error;
        }
    }
    
    async function getAllOrders() {
        try {
            const query = "SELECT * FROM orders ORDER BY position";

            const response = await database.getAllAsync<OrderDatabase>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function getActiveOrders() {
        try {
            const query = "SELECT * FROM orders WHERE isComplete = 0 ORDER BY position";

            const response = await database.getAllAsync<OrderDatabase>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: OrderDatabase) {
        const statement = await database.prepareAsync(
          "UPDATE orders SET description = $description, position = $position WHERE id = $id"
        )
    
        try {
          await statement.executeAsync({
            $id: data.id,
            $description: data.description,
            $position: data.position,
          })
        } catch (error) {
          throw error
        } finally {
          await statement.finalizeAsync()
        }
    }

    async function remove(id: number) {
        try {
            await database.execAsync("DELETE FROM orders WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    async function getOrderById(id: number) {
        try {
            const query = "SELECT * FROM orders WHERE id LIKE ?"

            const response = await database.getFirstAsync<OrderDatabase>(
            query,
            `%${id}%`
            )

            return response
        } catch (error) {
            throw error
        }
    }

    return { create, getMaxPosition, getAllOrders, remove, update, getOrderById, getActiveOrders }
}