import { useSubscription, gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const WELCOME_SUBSCRIPTIN = gql`
  subscription {
    welcomeWatch
  }
`;

const WELCOME_QUERY = gql`
  query {
    welcome {
      invoice {
        id
        name
        price
      }
    }
  }
`;

const Home = () => {
  const { data } = useSubscription(WELCOME_SUBSCRIPTIN);
  const [sendWelcome, welcome] = useLazyQuery(WELCOME_QUERY);

  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);

    toast.success("Pagamento aprovado com sucesso!");
  }, [data]);

  return (
    <div>
      <h4>Home</h4>
      <button type="button" onClick={() => sendWelcome()}>
        Request
      </button>
      <div>
        <pre>{JSON.stringify(welcome.data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Home;
