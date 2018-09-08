import { ApolloServer, gql, IResolvers } from "apollo-server";
import dayjs from "dayjs";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

const typeDefs = gql`
  scalar MyDate

  type Query {
    tomorrow(date: MyDate!): MyDate!
    yesterday(date: MyDate!): MyDate!
  }
`;

const resolvers: IResolvers = {
  Query: {
    tomorrow: (_, { date }) => {
      return date.add(1, "day");
    },
    yesterday: (_, { date }) => {
      return date.subtract(1, "day");
    }
  },
  MyDate: new GraphQLScalarType({
    name: "Date",
    description: "Custom description for the date scalar",
    parseValue(value) {
      return dayjs(value); // value from the client
    },
    serialize(value) {
      return dayjs(value).format("MM-DD-YYYY"); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return dayjs(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
