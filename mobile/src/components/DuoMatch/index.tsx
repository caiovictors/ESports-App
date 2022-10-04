import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ModalProps,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckCircle } from "phosphor-react-native";
import * as ClipBoard from "expo-clipboard";

import { Heading } from "../Heading";

import { styles } from "./styles";
import { THEME } from "../../theme";

interface Props extends ModalProps {
  discord: string;
  onClose: () => void;
}

export function DuoMatch({ discord, onClose, ...rest }: Props) {
  const [isCopying, setIsCopying] = useState(false);

  async function handleCopyDiscordToClipboard() {
    setIsCopying(true);
    await ClipBoard.setStringAsync(discord);
    ToastAndroid.show(
      "Usuário discord copiado para área de transferência",
      ToastAndroid.SHORT
    );
    setIsCopying(false);
  }

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onClose}
      {...rest}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={20}
              color={THEME.COLORS.CAPTION_500}
            />
          </TouchableOpacity>
          <CheckCircle size={64} color={THEME.COLORS.SUCCESS} weight="bold" />
          <Heading
            title="Let's play!"
            subtitle="Agora é só começar a jogar!"
            style={{ alignItems: "center", marginTop: 24 }}
          />
          <Text style={styles.label}>Adicione no Discord</Text>
          <TouchableOpacity
            style={styles.discordButton}
            onPress={handleCopyDiscordToClipboard}
            disabled={isCopying}
          >
            <Text style={styles.discord}>
              {isCopying ? (
                <ActivityIndicator color={THEME.COLORS.PRIMARY} />
              ) : (
                discord
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
