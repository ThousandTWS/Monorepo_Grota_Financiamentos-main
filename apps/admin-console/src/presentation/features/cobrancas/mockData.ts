export type Customer = {
  id: string;
  name: string;
  document: string;
  birthDate: string;
  phones: string[];
  email: string;
  address: string;
  city: string;
  state: string;
};

export type Vehicle = {
  brand: string;
  model: string;
  year: number;
  plate: string;
};

export type Installment = {
  number: number;
  dueDate: string;
  amount: number;
  paid: boolean;
};

export type Occurrence = {
  id: string;
  date: string;
  contact: string;
  note: string;
};

export type Contract = {
  id: string;
  customerId: string;
  status: "Pago" | "Em aberto" | "Em atraso";
  paidAt: string;
  startDate: string;
  financedValue: number;
  installmentValue: number;
  installmentsTotal: number;
  vehicle: Vehicle;
  installments: Installment[];
  occurrences: Occurrence[];
};

export const customers: Customer[] = [
  {
    id: "cli-001",
    name: "Marina Araujo",
    document: "123.456.789-00",
    birthDate: "1988-06-14",
    phones: ["(11) 99876-2233", "(11) 3344-5566"],
    email: "marina.araujo@email.com",
    address: "Rua das Acacias, 482 - Jardim Europa",
    city: "Sao Paulo",
    state: "SP",
  },
  {
    id: "cli-002",
    name: "Carlos Henrique Souza",
    document: "35.789.654/0001-90",
    birthDate: "1979-02-03",
    phones: ["(21) 99771-1122"],
    email: "carlos.souza@empresa.com",
    address: "Av. Atlantica, 990 - Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    id: "cli-003",
    name: "Fernanda Lima",
    document: "987.654.321-00",
    birthDate: "1992-11-28",
    phones: ["(31) 98888-4455"],
    email: "fernanda.lima@email.com",
    address: "Rua das Palmeiras, 140 - Centro",
    city: "Belo Horizonte",
    state: "MG",
  },
];

export const contracts: Contract[] = [
  {
    id: "14-345-2177",
    customerId: "cli-001",
    status: "Em aberto",
    paidAt: "2026-01-02",
    startDate: "2026-01-02",
    financedValue: 32000,
    installmentValue: 1480.5,
    installmentsTotal: 24,
    vehicle: {
      brand: "Fiat",
      model: "Argo Drive",
      year: 2021,
      plate: "FJL-2B19",
    },
    installments: [
      { number: 1, dueDate: "2026-02-01", amount: 1480.5, paid: false },
      { number: 2, dueDate: "2026-03-01", amount: 1480.5, paid: false },
      { number: 3, dueDate: "2026-04-01", amount: 1480.5, paid: false },
      { number: 4, dueDate: "2026-05-01", amount: 1480.5, paid: false },
    ],
    occurrences: [
      {
        id: "occ-001",
        date: "30/01/2026",
        contact: "Vini",
        note: "Ligou para o cliente e confirmou recebimento do carne.",
      },
    ],
  },
  {
    id: "14-345-3333",
    customerId: "cli-001",
    status: "Pago",
    paidAt: "2025-10-12",
    startDate: "2025-10-12",
    financedValue: 18000,
    installmentValue: 920.2,
    installmentsTotal: 18,
    vehicle: {
      brand: "Hyundai",
      model: "HB20 Comfort",
      year: 2019,
      plate: "HPP-7D40",
    },
    installments: [
      { number: 1, dueDate: "2025-11-12", amount: 920.2, paid: true },
      { number: 2, dueDate: "2025-12-12", amount: 920.2, paid: true },
      { number: 3, dueDate: "2026-01-12", amount: 920.2, paid: true },
    ],
    occurrences: [
      {
        id: "occ-010",
        date: "15/10/2025",
        contact: "Suporte",
        note: "Cliente recebeu boletos e confirmou dados de vencimento.",
      },
    ],
  },
  {
    id: "22-778-9011",
    customerId: "cli-002",
    status: "Em atraso",
    paidAt: "2025-12-05",
    startDate: "2025-12-05",
    financedValue: 45000,
    installmentValue: 1998.9,
    installmentsTotal: 30,
    vehicle: {
      brand: "Toyota",
      model: "Corolla GLi",
      year: 2020,
      plate: "RKM-4F58",
    },
    installments: [
      { number: 1, dueDate: "2026-01-05", amount: 1998.9, paid: false },
      { number: 2, dueDate: "2026-02-05", amount: 1998.9, paid: false },
      { number: 3, dueDate: "2026-03-05", amount: 1998.9, paid: false },
    ],
    occurrences: [
      {
        id: "occ-020",
        date: "20/01/2026",
        contact: "Nayara",
        note: "Cliente informou que vai pagar a primeira parcela ate dia 25.",
      },
      {
        id: "occ-021",
        date: "28/01/2026",
        contact: "Nayara",
        note: "Reforco de cobranca enviado por WhatsApp.",
      },
    ],
  },
  {
    id: "30-112-7744",
    customerId: "cli-003",
    status: "Em aberto",
    paidAt: "2026-01-18",
    startDate: "2026-01-18",
    financedValue: 27000,
    installmentValue: 1260.75,
    installmentsTotal: 24,
    vehicle: {
      brand: "Chevrolet",
      model: "Onix LT",
      year: 2022,
      plate: "PDS-9H11",
    },
    installments: [
      { number: 1, dueDate: "2026-02-18", amount: 1260.75, paid: false },
      { number: 2, dueDate: "2026-03-18", amount: 1260.75, paid: false },
      { number: 3, dueDate: "2026-04-18", amount: 1260.75, paid: false },
    ],
    occurrences: [
      {
        id: "occ-030",
        date: "19/01/2026",
        contact: "Atendimento",
        note: "Cliente solicitou envio do boleto para e-mail.",
      },
    ],
  },
];
