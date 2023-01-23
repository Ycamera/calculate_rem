import React, { ReactNode, useEffect, useState, useRef } from "react";
import { Box, Input, FormLabel, FormControl, Checkbox, Button, Text, Grid, Flex } from "@chakra-ui/react";
import { m_m } from "../utility/margin";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import { saveItemInLocalStorage, getItemInLocalStorage } from "../function/localStorage";

//form input compoonent
//フォームのインプットコンポーネント
type FormInputProps = {
    placeholder: string;
    label: string;
    mt?: string;
    valueKey: string;
    value: string;
    setValue: (key: string, value: string) => void;
};
export const FormInput: React.FC<FormInputProps> = ({ label, placeholder, mt = m_m, valueKey, value, setValue }) => {
    function onChangeValue(e: any) {
        const value = e.target.value;

        //全角数字を半角へ変換し、数字のみを取得
        function regExpConvertIntoNumber(str: string) {
            const num = Number(String.fromCharCode(str.charCodeAt(0) - 0xfee0));

            if (isNaN(num)) return "";
            return String(num);
        }

        const numberOfvalue = value.replace(/[^0-9]/g, regExpConvertIntoNumber);
        setValue(valueKey, numberOfvalue);
    }
    return (
        <FormControl display="grid" gridTemplateColumns="7.5rem 1fr" alignItems="center" mt={mt}>
            <FormLabel m="0">{label}</FormLabel>
            <Input pos="relative" placeholder={placeholder} value={value} onChange={onChangeValue} />
        </FormControl>
    );
};

//reset button component
//リセットボタンコンポーネント
type FormResetProps = { onClick: () => void };
export const FormReset: React.FC<FormResetProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick} w="calc(100% - 7.5rem)" display="block" ml="auto" mt={m_m}>
            reset
        </Button>
    );
};

//form container
//フォームコンテナ
type FormContainerProps = {
    children: ReactNode;
    [key: string]: string | number | ReactNode;
};
export const FormContainer: React.FC<FormContainerProps> = (props) => {
    const { children, ...otherProps } = props;

    return (
        <Box w="100%" maxW="16rem" m="auto" mt="3rem" borderRadius="0.5rem" p="1rem" boxShadow="0 0 1rem lightgray" {...otherProps}>
            {children}
        </Box>
    );
};

//form output component
//フォームのアウトプットコンポーネント
type FormOutputProps = { outputText: string; copyText: () => void };
export const FormOutput: React.FC<FormOutputProps> = ({ outputText, copyText }) => {
    const [copyIconIsShow, setCopyIconIsShow] = useState<boolean>(true);

    //toggle copy icon
    //コピーアイコンの切り替え
    let timer: any;
    function toggleCopyIconIsShow(): void {
        if (!outputText.length) return;
        copyText();

        setCopyIconIsShow((_) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setCopyIconIsShow(true);
            }, 750);
            return false;
        });
    }

    //option state
    //optionの状態管理
    type OptionType = {
        autoCopy: boolean;
    };
    const [option, setOption] = useState<OptionType>({ autoCopy: false });

    //copy converted rem into clipboard
    //変換後remをクリップボードに自動コピー

    let autoCopyTimer: any;
    useEffect(() => {
        clearTimeout(autoCopyTimer);
        if (outputText === "") return;
        if (!option.autoCopy) return;

        autoCopyTimer = setTimeout(() => {
            toggleCopyIconIsShow();
            console.log("start");
        }, 500);

        //clean up
        //副作用クリーンアップ
        return () => {
            clearTimeout(autoCopyTimer);
        };
    }, [outputText]);

    //detect if autocopy state is changed
    //自動コピーの変更管理
    function onChangeAutoCopy(e: any) {
        const check = e.target.checked;

        setOption((prev) => {
            saveItemInLocalStorage("option", { ...option, autoCopy: check });
            return { ...prev, autoCopy: check };
        });
    }

    //get option state from localStorage and set it in option state
    //option情報をlocalStorageから読み込む、取得した情報をoption stateに保存
    useEffect(() => {
        const optionItem = getItemInLocalStorage("option");
        if (!optionItem) return;
        setOption(optionItem);
    }, []);

    return (
        <>
            <Flex alignItems="center">
                <Checkbox colorScheme="teal" onChange={onChangeAutoCopy} isChecked={option.autoCopy}>
                    <Text color="gray.400" fontSize="0.8rem">
                        自動コピー
                    </Text>
                </Checkbox>

                <Button
                    pos="relative"
                    display="block"
                    colorScheme="teal"
                    ml="auto"
                    p="0.5rem"
                    w="1.5rem"
                    h="1.5rem"
                    bg="teal.500"
                    onClick={toggleCopyIconIsShow}
                    {...(!copyIconIsShow && {
                        bg: "teal.300",
                        _hover: {
                            bg: "teal.300",
                        },
                    })}
                >
                    <CopyIcon
                        w="1rem"
                        pos="absolute"
                        inset="0"
                        m="auto"
                        clipPath={copyIconIsShow ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"}
                        {...(!copyIconIsShow && { transition: "0.2s" })}
                    />
                    <CheckIcon
                        w="0.8rem"
                        pos="absolute"
                        inset="0"
                        m="auto"
                        clipPath={!copyIconIsShow ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)"}
                        {...(!copyIconIsShow && { transition: "0.2s" })}
                    />
                </Button>
            </Flex>

            <Grid gridTemplateColumns="7.5rem 1fr" mt="1rem" alignItems="center" minH="2.5rem">
                <Text display="flex" alignItems="center" h="100%">
                    変換後のrem
                </Text>
                <Text
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    h="100%"
                    fontWeight="bold"
                    paddingInline="0.5rem"
                    borderRadius="0.5rem"
                    bg="teal.50"
                >
                    {outputText ? outputText + "rem" : ""}
                </Text>
            </Grid>
        </>
    );
};
