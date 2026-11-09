import { List } from "@chakra-ui/react";

export type ResultsListProps = {
  names: { id: number; name: string }[];
};

// Results: a plain list of names until the results list task (#9) brings the cards.
export const ResultsList = ({ names }: ResultsListProps) => {
  return (
    <List.Root as="ul" listStyle="none" display="grid" gap="3">
      {names.map((show) => (
        <List.Item key={show.id} fontSize="lg" fontWeight="bold">
          {show.name}
        </List.Item>
      ))}
    </List.Root>
  );
};
