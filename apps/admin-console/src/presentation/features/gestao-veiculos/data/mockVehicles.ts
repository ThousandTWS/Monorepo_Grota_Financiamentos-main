import { Vehicle } from "@/application/core/@types/Vehicles";

export const mockVehicles: Vehicle[] = [
  {
    id: "VEH-001",
    dealerId: "DEALER-001",
    dealerName: "Auto Peças Silva",
    brand: "Toyota",
    model: "Corolla XEi",
    year: 2023,
    modelYear: 2024,
    color: "Prata",
    licensePlate: "ABC-1D23",
    chassisNumber: "9BWZZZ377VT004251",
    renavam: "00123456789",
    mileage: 15000,
    condition: "semi_new",
    fuelType: "flex",
    transmission: "automatic",
    doors: 4,
    price: 125000,
    costPrice: 110000,
    description:
      "Veículo em excelente estado de conservação, único dono, todas as revisões em dia.",
    features: [
      "Ar Condicionado",
      "Direção Elétrica",
      "Vidros Elétricos",
      "Trava Elétrica",
      "Airbag Duplo",
      "Freios ABS",
    ],
    images: ["corolla-1.jpg", "corolla-2.jpg"],
    status: "available",
    createdAt: "2024-01-10T10:00:00",
    updatedAt: "2024-01-15T14:30:00",
  },
];
