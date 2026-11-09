import { Box, chakra, Heading, Text } from "@chakra-ui/react";
import { Icon } from "@/lib/components/Icon/Icon";
import { usePresenter, type ShowCardProps } from "./usePresenter";

export type { ShowCardProps } from "./usePresenter";

// ShowCard of design/library: the poster with the rating, the name and one line of details. From md the poster is
// above the text; below it, a thumbnail sits beside the text, as in the one-column list of design/v0.1.
export const ShowCard = (props: ShowCardProps) => {
  const { name, href, imageSrc, imageAlt, hasImage, ratingLabel, meta } = usePresenter(props);

  return (
    <chakra.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group"
      display={{ base: "grid", md: "block" }}
      gridTemplateColumns="{sizes.thumb} minmax(0, 1fr)"
      columnGap="4"
      alignItems="center"
      minW="0"
      rounded="md"
      focusVisibleRing="none"
      _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
    >
      <Box
        position="relative"
        gridRow="span 2"
        aspectRatio="2 / 3"
        rounded="md"
        overflow="hidden"
        bg="bg.subtle"
        boxShadow="poster"
      >
        {hasImage ? (
          <chakra.img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            display="block"
            w="full"
            h="full"
            objectFit="cover"
            transition="transform {durations.normal} {easings.standard}"
            _groupHover={{ transform: "scale(1.04)" }}
            _motionReduce={{ transition: "none" }}
          />
        ) : (
          <Box
            position="absolute"
            inset="0"
            display="grid"
            placeContent="center"
            justifyItems="center"
            gap="2"
            color="fg.subtle"
            fontSize="sm"
          >
            <Icon name="film" boxSize="10" strokeWidth="1.5" />
            No poster
          </Box>
        )}
        {ratingLabel && (
          <chakra.span
            position="absolute"
            top="3"
            left="3"
            px="2"
            py="1"
            rounded="full"
            bg="accent.solid"
            color="accent.contrast"
            fontSize="xs"
            fontWeight="extrabold"
          >
            {ratingLabel}
          </chakra.span>
        )}
      </Box>
      <Heading
        as="h3"
        mt={{ base: "0", md: "4" }}
        mb="1"
        alignSelf="end"
        fontSize="lg"
        fontWeight="bold"
        lineHeight="tight"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace={{ base: "normal", md: "nowrap" }}
        transition="color {durations.fast} {easings.standard}"
        _groupHover={{ color: "accent.fg" }}
      >
        {name}
      </Heading>
      <Text
        alignSelf="start"
        color="fg.muted"
        fontSize="sm"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace={{ base: "normal", md: "nowrap" }}
      >
        {meta}
      </Text>
    </chakra.a>
  );
};
