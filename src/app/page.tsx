import { NewTokens } from "@/components/NewTokens/NewTokens";
import { NewTokensDEX } from "@/components/NewTokensDEX/NewTokensDEX";
import { Searcher } from "@/components/Searcher/Searcher";

export default function Home() {
  return (
    <div className="grid gap-y-3 md:gap-y-4 gap-x-3 py-3 px-3 grid-rows-3 grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 min-h-[100vh] lg:h-[100vh] lg:mx-20 md:mx-10 h-auto rounded-xl">
      {/* Parte superior con dos columnas en pantallas grandes y una columna en pantallas pequeñas */}
      <div className="col-span-1 row-span-1 flex justify-center items-center ">
        <Searcher className="w-full h-full bg-primary-2 backdrop-blur-md bg-opacity-30 isolate aspect-video rounded-xl shadow-2xl shadow-blue-500/30 flex flex-col" />
      </div>
      <div className="col-span-1 row-span-1 flex justify-center items-center ">
        <NewTokensDEX className="w-full h-full bg-primary-2 backdrop-blur-md bg-opacity-30 isolate aspect-video rounded-xl shadow-2xl shadow-blue-500/20" />
      </div>

      {/* Parte inferior ocupando todo el ancho */}
      <div className="col-span-1 lg:col-span-2 row-span-1 flex justify-center items-center ">
        <NewTokens className="w-full lg:h-[calc(100vh-25rem)] h-full bg-primary-2 backdrop-blur-md bg-opacity-30 isolate aspect-video rounded-xl shadow-2xl shadow-blue-500/30" />
      </div>
    </div>
  );
}
