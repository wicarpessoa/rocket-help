import { useState } from "react";
import {
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
  FlatList,
  Center,
} from "native-base";
import { SignOut, ChatTeardropText } from "phosphor-react-native";
import { Filter } from "../components/Filter";
import Logo from "../assets/logo_secondary.svg";
import { Order, OrderProps } from "../components/order";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
export function Home() {
  const [statusSelected, setStatusSelected] = useState<"closed" | "open">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([
    { id: "123", patrimony: "123456", when: "xxxxx", status: "open" },
  ]);
  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleOrderDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleNewOrder() {
    navigation.navigate("new");
  }

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus chamados</Heading>
          <Text color="gray.200">3</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            title="em andamento"
            type="open"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            title="finalizados"
            type="closed"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Order
              onPress={() => {
                handleOrderDetails(item.id);
              }}
              data={item}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText size={40} color={colors.gray[300]} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"} solicitações{" "}
                {statusSelected === "open" ? "em andamento" : "finalizados"}
              </Text>
            </Center>
          )}
        />
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
