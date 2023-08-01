import {
  Box,
  Flex,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";

function SidebarMenu({ user }: { user: User }) {
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Menu>
      <MenuButton
        as={Box}
        paddingY={2}
        paddingX={{ base: 0, sm: 2 }}
        _hover={{ backgroundColor: "gray.700" }}
        color="white"
        isTruncated
      >
        <Flex alignItems="center" gap={2}>
          <Icon
            viewBox="0 0 24 24"
            boxSize={10}
            color="white"
            margin={{ base: "0 auto", sm: "initial" }}
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"
            />
          </Icon>
          <Text
            color="white"
            isTruncated
            display={{ base: "none", sm: "inline" }}
          >
            {user.email}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} to="/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={signOut}>Log out</MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SidebarMenu;
