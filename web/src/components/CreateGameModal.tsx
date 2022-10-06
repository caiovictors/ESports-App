import * as Dialog from "@radix-ui/react-dialog";
import { GameController, Check } from "phosphor-react";
import { Input } from "./Form/input";
import { useState, FormEvent } from "react";
import axios from "axios";
import { Game } from "../App";

interface NewGameProps {
  title: string;
  bannerUrl: string;
}

export function CreateGameModal({ games, handleCreateGame }: any) {
  const [title, setTitle] = useState<NewGameProps["title"]>("");
  const [bannerUrl, setBannerUrl] = useState<NewGameProps["bannerUrl"]>("");
  const [validImage, setValidImage] = useState(false);

  function cleanStates() {
    setTitle("");
    setBannerUrl("");
    setValidImage(true);
  }

  const handleInvalidForm = () => {
    return !(validImage && title.length !== 0 && bannerUrl.length !== 0);
  };

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const gameExists =
      games.filter((gameItem: Game) => gameItem?.title === title).length > 0;

    if (gameExists) {
      alert("Já existe um jogo com esse nome!");
      return;
    }

    handleCreateGame(title, bannerUrl);
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25 ">
        <Dialog.Title className="text-3xl font-black">
          Cadastre um novo jogo
        </Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Título do game</label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="ex.: Overwatch 2"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bannerUrl">URL do banner</label>
            <Input
              type="url"
              id="bannerUrl"
              name="bannerUrl"
              value={bannerUrl}
              placeholder="http://www.example.com/blabla.jpg"
              onChange={(e) => {
                setBannerUrl(e.target.value);
                setValidImage(true);
              }}
            />
          </div>

          {bannerUrl.length > 0 ? (
            validImage ? (
              <img
                src={bannerUrl}
                alt="Game Banner Preview"
                onError={() => setValidImage(false)}
                className="w-full object-contain rounded-lg "
              />
            ) : (
              <span>Imagem inválida</span>
            )
          ) : null}

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600 hover:translate-y-1"
              onClick={cleanStates}
            >
              Cancelar
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600 hover:translate-y-1"
              disabled={handleInvalidForm()}
            >
              <GameController className="w-6 h-6" />
              Cadastrar
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
