import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Box, Grid, Flex, Heading, Text, Button } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { FormInput, FormReset, FormContainer, FormOutput } from "../components/Form";
import { saveItemInLocalStorage, getItemInLocalStorage } from "../function/localStorage";

export type ValuesType = {
    fontsize: string;
    sizeToConvertIntoRem: string;
};

const Home: NextPage = () => {
    // form state
    //フォームの状態管理
    const defaultValues = { fontsize: "", sizeToConvertIntoRem: "" };
    const [values, setValues] = useState<ValuesType>(defaultValues);

    //set value
    //valueをセット
    function setValue(key: string, value: string): void {
        setValues((prev) => {
            const valueObj = { ...prev, [key]: value };
            saveItemInLocalStorage("rem", valueObj);
            return valueObj;
        });
    }
    //reset form
    //フォームリセット用
    function resetForm(): void {
        setValues({ ...values, sizeToConvertIntoRem: "" });
    }

    //converted rem state
    //変換後のremを管理
    const [calculatedRem, setCaluculatedRem] = useState<string>("");
    //convert px size into rem
    //変換元サイズをremに変換、
    useEffect(() => {
        const size = values.fontsize;
        const convertSize = values.sizeToConvertIntoRem;

        if (!size.length || !convertSize.length) return setCaluculatedRem("");

        const rem = String(Math.round((+convertSize / +size) * 100000) / 100000);
        setCaluculatedRem(rem);
    }, [values]);

    // get values in localStorage and save the values in values state
    //ローカルストレージ内のvaluesを取得、取得したvalueをvalue stateに保存
    useEffect(() => {
        const valuesObj = getItemInLocalStorage("rem");
        if (valuesObj) setValue("fontsize", valuesObj["fontsize"]);
    }, []);

    //copy text
    //テキストコピー関数
    function copyText(text: string) {
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <Head>
                <title>px/1rem 計算ツール</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Layout>
                    <Heading mt="5rem" textAlign="center">
                        px/1rem 計算ツール
                    </Heading>
                    <FormContainer>
                        <form>
                            <FormInput
                                valueKey="fontsize"
                                value={values?.fontsize}
                                setValue={setValue}
                                label="fontsize/1rem"
                                placeholder="px"
                                mt="0"
                            />
                            <FormInput
                                valueKey="sizeToConvertIntoRem"
                                value={values?.sizeToConvertIntoRem}
                                setValue={setValue}
                                label="変換元サイズ"
                                placeholder="px"
                            />
                            <FormReset onClick={resetForm} />
                        </form>
                    </FormContainer>

                    <FormContainer mt="1rem">
                        <FormOutput
                            outputText={calculatedRem}
                            copyText={() => {
                                copyText(calculatedRem + "rem");
                            }}
                        />
                    </FormContainer>
                </Layout>
            </main>
        </>
    );
};

export default Home;
