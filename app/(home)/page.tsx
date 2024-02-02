import { format } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Key } from "react";
import { Card, CardContent } from "../_components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../_components/ui/carousel";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="px-10">
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user
            ? `Olá, ${session.user.name?.split(" ")[0]}!`
            : "Olá! Vamos agendar um corte hoje?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="pl-5 text-xs mb-3 uppercase text-gray-400 font-bold">
              Agendamentos
            </h2>
            <Carousel >
              <CarouselContent className="px-3 py-3">
                {confirmedBookings.map((booking: { id: Key | null | undefined; }) => (
                  <CarouselItem
                    key={booking.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                  
                      <Card className="pt-3 sm:pt-5">
                        <CardContent>
                          <span>
                            <BookingItem key={booking.id} booking={booking} />
                          </span>
                        </CardContent>
                      </Card>
                 
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </>
        )}
      </div>

      <div className="mt-6 px-4">
        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">
          Recomendados
        </h2>

        
          <Carousel>
            <CarouselContent >
              {barbershops.map((barbershop: { id: Key }) => (
                <CarouselItem
                  key={barbershop.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-3">
                    <Card className="py-4 px-8">
                      <CardContent className="flex aspect-square items-center justify-center">
                        <span>
                          <BarbershopItem
                            key={barbershop.id}
                            barbershop={barbershop}
                          />
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
    
  );
}
