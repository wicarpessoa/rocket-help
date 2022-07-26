import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
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
import { Alert } from "react-native";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";
export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"closed" | "open">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleOrderDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleNewOrder() {
    navigation.navigate("new");
  }
  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert("Sair", " Não foi possível sair.");
      });
  }

  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setOrders(data);
        setIsLoading(false);
      });
    return subscriber;
  }, [statusSelected]);
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
        <IconButton
          onPress={handleLogout}
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
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
        {isLoading ? (
          <Loading />
        ) : (
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
        )}
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
