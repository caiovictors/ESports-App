import { useCallback, useEffect, useState } from "react";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

import Logo from "./assets/logo_nlw.svg";
import * as Dialog from "@radix-ui/react-dialog";

import { GameBanner } from "./components/GameBanner";
import { CreateAdBanner } from "./components/CreateAdBanner";
import { CreateAdModal } from "./components/CreateAdModal";

import axios from "axios";

import "./styles/main.css";
import { CreateGameModal } from "./components/CreateGameModal";
import { GameController } from "phosphor-react";
export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  };
}

function App() {
  const [games, setGames] = useState<Game[]>([]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 3, spacing: 5, origin: 0 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 6, spacing: 5, origin: 0 },
      },
    },
    slides: games.length,
    mode: "free",
  });

  async function handleCreateGame(title: string, bannerUrl: string) {
    try {
      await axios
        .post("http://localhost:3333/games", {
          title,
          bannerUrl,
        })
        .then(() => {
          alert("Game cadastrado com sucesso!");
          getGames();
        });
    } catch (error) {
      alert("Erro ao criar anúncio!");
    }
  }

  const getGames = useCallback(async () => {
    return await axios("http://localhost:3333/games").then((res) =>
      setGames(res.data)
    );
  }, []);

  useEffect(() => {
    getGames();
  }, [getGames]);

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <div className="flex flex-row">
        <img src={Logo} alt="Logo" />
      </div>
      <h1 className="text-6xl text-white font-black mt-20">
        Seu{" "}
        <span className="bg-nlw-gradient bg-clip-text text-transparent">
          duo
        </span>{" "}
        está aqui.
      </h1>
      <div className="absolute right-20">
        <Dialog.Root>
          <Dialog.Trigger className="ml-20 py-3 px-4 bg-violet-500 hover:bg-violet-700 hover:translate-y-1  text-white rounded flex items-center gap-3">
            <GameController className="w-6 h-6" />
            Cadastrar game
          </Dialog.Trigger>
          <CreateGameModal games={games} handleCreateGame={handleCreateGame} />
        </Dialog.Root>
      </div>

      <div ref={sliderRef} className="grid grid-cols-6 gap-6 mt-16 keen-slider">
        {games.map((game) => {
          return (
            <GameBanner
              key={game.id}
              title={game.title}
              bannerUrl={game.bannerUrl}
              adsCount={game._count.ads}
            />
          );
        })}
      </div>
      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal getGames={getGames} />
      </Dialog.Root>
    </div>
  );
}

export default App;
