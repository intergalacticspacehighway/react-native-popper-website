import React from "react";
import {
  NativeBaseProvider,
  Box,
  Code,
  Radio,
  Text,
  Heading,
  VStack,
  HStack,
  Checkbox,
  Input,
  Link,
  Icon,
} from "native-base";
import { Popover } from "react-native-popper";
import { Platform, Pressable, ScrollView, SafeAreaView } from "react-native";

type IAction = {
  type: string;
  payload: any;
};

type IState = {
  placement: {
    main: any;
    cross: any;
  };
  hasArrow: boolean;
  hasBackdrop: boolean;
  on: string;
  offset: number;
  crossOffset: number;
  shouldOverlapWithTrigger: boolean;
};

const initialState: IState = {
  hasArrow: true,
  hasBackdrop: Platform.OS !== "web",
  placement: {
    main: "bottom",
    cross: null,
  },
  on: "press",
  offset: 0,
  crossOffset: 0,
  shouldOverlapWithTrigger: false,
};

const generateCodeString = ({
  placement: statePlacement,
  hasArrow,
  hasBackdrop,
  offset,
  crossOffset,
  shouldOverlapWithTrigger,
  on,
}: IState) => {
  const placement =
    statePlacement.main +
    (statePlacement.cross ? " " + statePlacement.cross : "");
  return `
    <Popover
      on="${on}"
      placement="${placement}"
      trigger={
        <Button>
          <Text>Press me</Text>
        </Button>
      }
      ${offset ? `offset={${offset}}` : ""}
      ${crossOffset ? `crossOffset={${crossOffset}}` : ""}
      ${
        shouldOverlapWithTrigger
          ? `shouldOverlapWithTrigger={${shouldOverlapWithTrigger}}`
          : ""
      }
    >
      ${hasBackdrop ? "<Popover.Backdrop />" : ""}
      <Popover.Content>
        ${
          hasArrow
            ? `<Popover.Arrow />
        <Text>Hello from popover</Text>`
            : "<Text>Hello from popover</Text>"
        }
      </Popover.Content>
    </Popover>
    `;
};

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case "PLACEMENT_MAIN_AXIS_CHANGE":
      let cross = state.placement.cross;
      if (state.placement.main !== action.payload) {
        cross = null;
      }
      return {
        ...state,
        placement: { ...state.placement, main: action.payload, cross },
      };
    case "PLACEMENT_CROSS_AXIS_CHANGE":
      return {
        ...state,
        placement: { ...state.placement, cross: action.payload },
      };
    case "ARROW_CHANGE":
      return { ...state, hasArrow: action.payload };
    case "OFFSET_CHANGE":
      return { ...state, offset: action.payload };
    case "CROSS_OFFSET_CHANGE":
      return { ...state, crossOffset: action.payload };
    case "ON_TRIGGER_CHANGE":
      // We need to remove backdrop when trigger is set to hover
      return { ...state, on: action.payload, hasBackdrop: false };
    case "BACKDROP_CHANGE":
      return { ...state, hasBackdrop: action.payload };
    case "SHOULD_OVERLAP_WITH_TRIGGER":
      return { ...state, shouldOverlapWithTrigger: action.payload };

    default:
      return state;
  }
};

const Header = () => {
  return (
    <Box width="100%">
      <SafeAreaView>
        <HStack
          justifyContent="center"
          alignItems="center"
          py={2}
          borderBottomWidth={1}
          space={2}
          borderBottomColor="gray.100"
        >
          <Heading size="md" alignItems="center" textAlign="center">
            React native popper
          </Heading>
          {Platform.OS === "web" ? (
            <Text
              hrefAttrs={{ target: "blank" }}
              height={8}
              href="https://github.com/intergalacticspacehighway/react-native-popper"
            >
              <Icon
                type="AntDesign"
                name="github"
                size={8}
                color="emerald.500"
              />
            </Text>
          ) : (
            <Link
              height={8}
              href="https://github.com/intergalacticspacehighway/react-native-popper"
            >
              <Icon
                type="AntDesign"
                name="github"
                size={8}
                color="emerald.500"
              />
            </Link>
          )}
        </HStack>
      </SafeAreaView>
    </Box>
  );
};

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <NativeBaseProvider>
      <Box flex={1} borderWidth={8} borderColor="emerald.500">
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Box flex={1}>
            <Header />
            <Box flex={1} flexDirection="row">
              <Box flex={1} borderRightWidth={1} borderColor="gray.100">
                <SelectionControls state={state} dispatch={dispatch} />
                {Platform.OS === "web" ? (
                  <Box px={4}>
                    <Code colorScheme="success">
                      {generateCodeString(state)}
                    </Code>
                  </Box>
                ) : (
                  <Box alignItems="center" mt={10}>
                    <PopoverDemo state={state} />
                  </Box>
                )}
              </Box>
              {Platform.OS === "web" && (
                <Box flex={1} justifyContent="center">
                  <PopoverDemo state={state} />
                </Box>
              )}
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
}

const PopoverDemo = ({ state }: { state: IState }) => {
  const placement = (state.placement.main +
    (state.placement.cross ? " " + state.placement.cross : "")) as any;
  return (
    <Popover
      placement={placement}
      on={state.on as any}
      defaultIsOpen
      onOpenChange={console.log}
      offset={state.offset}
      crossOffset={state.crossOffset}
      shouldOverlapWithTrigger={state.shouldOverlapWithTrigger}
      trigger={
        <Pressable style={{ maxWidth: 120, marginHorizontal: "auto" }}>
          <Box bg="emerald.500" color="gray.800" px={4} py={4} borderRadius={4}>
            <Text>Press me</Text>
          </Box>
        </Pressable>
      }
    >
      {state.hasBackdrop && <Popover.Backdrop />}
      <Popover.Content>
        {state.hasArrow && <Popover.Arrow color="#3f3f46"></Popover.Arrow>}
        <Box p={6} bg="gray.700" borderRadius="md">
          <Text color="#fff">Hello from popover</Text>
        </Box>
      </Popover.Content>
    </Popover>
  );
};

const SelectionControls = ({
  state,
  dispatch,
}: {
  state: IState;
  dispatch: any;
}) => {
  return (
    <VStack p={4} space={4}>
      <Box>
        <Heading size="lg" my={2}>
          Placement
        </Heading>
        <Box justifyContent="space-around" flexDirection="row">
          <Box alignItems="center">
            <Heading size="sm">Main</Heading>
            <Box>
              <Radio.Group
                name="Placement - Main"
                colorScheme="emerald"
                value={state.placement.main}
                onChange={(nextValue: string) => {
                  dispatch({
                    type: "PLACEMENT_MAIN_AXIS_CHANGE",
                    payload: nextValue,
                  });
                }}
                minWidth={100}
              >
                <Radio value="top" my={1}>
                  <Text mx={1}>Top</Text>
                </Radio>
                <Radio value="bottom" my={1}>
                  <Text mx={1}>Bottom</Text>
                </Radio>
                <Radio value="left" my={1}>
                  <Text mx={1}>Left</Text>
                </Radio>
                <Radio value="right" my={1}>
                  <Text mx={1}>Right</Text>
                </Radio>
              </Radio.Group>
            </Box>
          </Box>
          <Box>
            <Heading size="sm">Cross</Heading>
            <Radio.Group
              minWidth={100}
              name="Placement - Cross"
              colorScheme="emerald"
              value={state.placement.cross}
              onChange={(nextValue: string) => {
                dispatch({
                  type: "PLACEMENT_CROSS_AXIS_CHANGE",
                  payload: nextValue,
                });
              }}
            >
              <Radio value={null} my={1}>
                <Text mx={1}>None</Text>
              </Radio>
              {["top", "bottom"].includes(state.placement.main) ? (
                <>
                  <Radio value="left" my={1}>
                    <Text mx={1}>Left</Text>
                  </Radio>
                  <Radio value="right" my={1}>
                    <Text mx={1}>Right</Text>
                  </Radio>
                </>
              ) : (
                <>
                  <Radio value="top" my={1}>
                    <Text mx={1}>Top</Text>
                  </Radio>
                  <Radio value="bottom" my={1}>
                    <Text mx={1}>Bottom</Text>
                  </Radio>
                </>
              )}
            </Radio.Group>
          </Box>
        </Box>
      </Box>
      <Box justifyContent="space-around" flexDirection="row">
        <Checkbox
          value="hasArrow"
          isChecked={state.hasArrow}
          onChange={(value: boolean) => {
            dispatch({ type: "ARROW_CHANGE", payload: value });
          }}
        >
          <Text mx={1}>Has Arrow</Text>
        </Checkbox>

        <Checkbox
          value="hasBackdrop"
          isChecked={state.hasBackdrop}
          onChange={(value: boolean) => {
            dispatch({ type: "BACKDROP_CHANGE", payload: value });
          }}
        >
          <Text mx={1}>Has Backdrop</Text>
        </Checkbox>
        <Checkbox
          value="shouldOverlapWithTrigger"
          isChecked={state.shouldOverlapWithTrigger}
          onChange={(value: boolean) => {
            console.log("al ", value);
            dispatch({ type: "SHOULD_OVERLAP_WITH_TRIGGER", payload: value });
          }}
        >
          <Text mx={1}>overlap with trigger</Text>
        </Checkbox>
      </Box>
      <Box>
        <Heading size="lg" my={2}>
          Offset
        </Heading>
        <Box justifyContent="space-around" flexDirection="row">
          <Box flex={1}>
            <Heading size="sm">Main</Heading>
            <Input
              value={state.offset.toString()}
              onChangeText={(value: string) => {
                let parsedValue = parseInt(value, 10);
                if (value === "") {
                  parsedValue = 0;
                }
                if (Number.isNaN(parsedValue)) return;
                dispatch({ type: "OFFSET_CHANGE", payload: parsedValue });
              }}
            />
          </Box>
          <Box size={4} />
          <Box flex={1}>
            <Heading size="sm">Cross</Heading>
            <Input
              value={state.crossOffset.toString()}
              onChangeText={(value: string) => {
                let parsedValue = parseInt(value, 10);
                if (value === "") {
                  parsedValue = 0;
                }
                if (Number.isNaN(parsedValue)) return;
                dispatch({ type: "CROSS_OFFSET_CHANGE", payload: parsedValue });
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box>
        <Heading size="lg" my={2}>
          On
        </Heading>
        <Radio.Group
          name="on"
          colorScheme="emerald"
          value={state.on}
          onChange={(nextValue: string) => {
            dispatch({ type: "ON_TRIGGER_CHANGE", payload: nextValue });
          }}
        >
          <HStack w="100%" justifyContent="space-around">
            <Radio value="press" my={1}>
              <Text mx={1}>Press</Text>
            </Radio>
            {Platform.OS === "web" && (
              <Radio value="hover" my={1}>
                <Text mx={1}>Hover</Text>
              </Radio>
            )}

            <Radio value="longPress" my={1}>
              <Text mx={1}>Long press</Text>
            </Radio>
          </HStack>
        </Radio.Group>
      </Box>
    </VStack>
  );
};
