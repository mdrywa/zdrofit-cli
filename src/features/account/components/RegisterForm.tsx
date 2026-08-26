import React, {useState} from "react";
import {Box, Text, useInput} from "ink";
import TextInput from "ink-text-input";
import {colors} from "../../../theme/colors.ts";
import type {AccountInput} from "../account.types.ts";
import {useTranslations} from "../../../i18n/useTranslations.ts";

type RegisterFormProps = {
    onSubmit: (input: AccountInput) => Promise<unknown>;
};

export function RegisterForm({onSubmit}: RegisterFormProps) {
    const {messages} = useTranslations();
    const text = messages.screens.newAccount;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    type Field = "name" | "email" | "password";
    const fields: Field[] = ["name", "email", "password"];
    const [activeField, setActiveField] = useState<Field>("name");


    useInput((_input, key) => {
        if (key.tab || key.downArrow || key.upArrow) {
            const direction = key.upArrow || (key.tab && key.shift) ? -1 : 1;

            setActiveField(current => {
                const currentIndex = fields.indexOf(current);
                const nextIndex = (currentIndex + direction + fields.length) % fields.length;

                return fields[nextIndex]!;
            });
        }

        if (key.return) {
            if (activeField === "password") {
                handleSubmit();
            } else {
                setActiveField(activeField === "name" ? "email" : "password");
            }
        }
    })

    function handleSubmit(): void {
        void onSubmit({name, email, password});
    }

    return (
        <Box flexDirection={"column"}>
            <Box flexDirection={"row"}>
                <Text color={activeField === "name" ? colors.text.primary : colors.text.muted}>{messages.common.labels.name}: </Text>
                <Text color={activeField === "name" ? colors.brand : colors.text.primary}>
                    <TextInput
                        value={name}
                        onChange={setName}
                        focus={activeField === "name"}
                        placeholder={text.placeholders.name}
                    />
                </Text>
            </Box>

            <Box flexDirection={"row"}>
                <Text color={activeField === "email" ? colors.text.primary : colors.text.muted}>{text.fields.email}: </Text>
                <Text color={activeField === "email" ? colors.brand : colors.text.primary}>
                    <TextInput
                        value={email}
                        onChange={setEmail}
                        focus={activeField === "email"}
                        placeholder={text.placeholders.email}
                    />
                </Text>
            </Box>

            <Box flexDirection={"row"}>
                <Text color={activeField === "password" ? colors.text.primary : colors.text.muted}>{text.fields.password}: </Text>
                <Text color={activeField === "password" ? colors.brand : colors.text.primary}>
                    <TextInput
                        value={password}
                        onChange={setPassword}
                        focus={activeField === "password"}
                        mask={"*"}
                        placeholder={text.placeholders.password}
                    />
                </Text>
            </Box>
        </Box>
    )
}
