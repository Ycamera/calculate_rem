import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
type Props = {};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Box w="calc(100% - 1rem)" maxW="60rem" m="auto">
            {children}
        </Box>
    );
};

export default Layout;
