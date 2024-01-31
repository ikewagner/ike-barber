import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ServiceItem from "../_components/service-item";
import BarbershopInfo from "../_components/barbershop-info";
import { Key } from "react";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    // TODO: redirecionar para home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    // TODO: redirecionar para home page
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service: { id: Key | null | undefined; }) => (
          <ServiceItem key={service.id} service={service} isAuthenticated={!!session?.user} />
        ))}
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;