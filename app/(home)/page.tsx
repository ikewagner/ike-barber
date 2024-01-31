import Image from "next/image";
import Header from "../_components/header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import BarbershopItem from "./_components/barbershop-item";
import { db } from "../_lib/prisma";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../_components/ui/carousel";
import { Card, CardContent } from "../_components/ui/card";

export default async function Home() {
  const barbershops = await db.barbershop.findMany({});

  return (
    <div className=" mx-auto px-8">
      <Header />

      <div className="pt-5">
        <h2 className="text-xl font-bold">Olá, Henrique!</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="mt-6">
        <Search />
      </div>

      <div className="mt-6">
        <h2 className="text-xs mb-3 uppercase text-gray-400 font-bold">
          Agendamentos
        </h2>
        <BookingItem />
      </div>

      <div className="mt-6 md: pt-4">
        <h2 className="text-xs mb-3 uppercase text-gray-400 font-bold">
          Recomendados
        </h2>
        <div className="flex justify-center items-center p-5 py-0 w-full">
          <Carousel className="w-full">
            <CarouselContent className="-ml-1">
              {barbershops.map((barbershop) => (
                <CarouselItem
                  key={barbershop.id}
                  className="pl-4 pb-3 lg:basis-1/5 md:basis-1/3  sm:basis-1/2"
                >
                  <div className="p-1">
                    <Card className="py-4 px-8">
                      <CardContent className="flex aspect-square items-center justify-center">
                        <span>
                          <BarbershopItem barbershop={barbershop} />
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
