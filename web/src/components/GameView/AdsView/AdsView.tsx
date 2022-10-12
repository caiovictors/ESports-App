import { Check, GameController } from "phosphor-react";
import { defaultButtonBackground, defaultButtonStyle } from "../../Utils";
import { AdProps } from "../GameView";
import { AdsInfos } from "./AdsInfos";

import axios from "axios";
import { useState } from "react";
import Loader from "../../Loader";

export function AdsView({ ad }: AdProps) {
  const [gettingDiscord, setGettingDiscord] = useState(false);
  const [discordCoppied, setDiscordCoppied] = useState(false);

  async function getDiscordUser() {
    setGettingDiscord(true);
    try {
      axios(`http://localhost:3333/ads/${ad.id}/discord`).then((res) => {
        setGettingDiscord(false);
        setDiscordCoppied(true);
        navigator.clipboard.writeText(res.data.discord);
        setTimeout(function () {
          setDiscordCoppied(false);
        }, 1500);
      });
    } catch {
      console.log("erro");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-2 bg-zinc-900 rounded-lg py-4 gap-2 mb-4 keen-slider__slide">
      <AdsInfos label="Nome" value={ad.name} />
      <AdsInfos
        label="Tempo de jogo"
        value={
          ad.yearsPlaying === 0
            ? "Nunca jogou"
            : String(ad.yearsPlaying) +
              (ad.yearsPlaying === 1 ? " ano" : " anos")
        }
      />
      <AdsInfos
        label="Disponibilidade"
        value={`${ad.weekDays.length} dias \u2022 ${ad.hoursStart} - ${ad.hourEnd}`}
      />
      <AdsInfos
        label="Chamada de áudio"
        value={ad.useVoiceChannel ? "Sim" : "Não"}
        colorValue={ad.useVoiceChannel ? "text-[#038C3E]" : "text-red-700"}
      />
      <div className="flex items-center justify-center w-full">
        <button
          className={`h-10 text-sm w-full flex items-center justify-center ${defaultButtonStyle} ${defaultButtonBackground}`}
          onClick={getDiscordUser}
        >
          {gettingDiscord ? (
            <Loader size={"xsm"} />
          ) : (
            <>
              {discordCoppied ? (
                <div className="relative flex items-center pl-4">
                  <Check className="absolute w-6 h-6 left-[-12px]" />
                  User copiado
                </div>
              ) : (
                <>
                  <GameController className="w-6 h-6" />
                  Conectar
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
