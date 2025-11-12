import api from "../server/api";

export type DashboardTimeframe = "7d" | "30d" | "quarter";

export type DashboardKpiResponse = {
  label: string;
  value: string;
  delta: string;
  helper: string;
  detail?: string | null;
  trend: "up" | "down";
  icon: string;
};

export type DashboardMonthlyPerformancePoint = {
  month: string;
  volume: number;
  approvals: number;
};

export type DashboardChannelMixSegment = {
  key: string;
  label: string;
  value: number;
};

export type DashboardPartnerDealer = {
  name: string;
  city: string;
  volume: string;
  variation: string;
  progress: number;
};

export type DashboardExecutiveHighlight = {
  label: string;
  value: string;
  helper: string;
};

export type DashboardGovernanceAlert = {
  title: string;
  status: string;
  tone: "success" | "warning" | "info";
  description: string;
};

export type DashboardProposal = {
  id: string;
  client: string;
  vehicle: string;
  amount: string;
  status: string;
  updatedAt: string;
};

export type DashboardMeta = {
  lastUpdateLabel?: string;
  activePortfolioLabel?: string;
  slaLabel?: string;
  timeframeLabel?: string;
  goalLabel?: string;
  goalValue?: string;
  goalDeltaLabel?: string;
  portfolioMonitorLabel?: string;
  portfolioValue?: string;
  portfolioDetail?: string;
  portfolioInsight?: string;
  complianceInsight?: string;
};

export type DashboardSnapshotResponse = {
  kpis: DashboardKpiResponse[];
  monthlyPerformance: DashboardMonthlyPerformancePoint[];
  channelMix: DashboardChannelMixSegment[];
  partnerDealers: DashboardPartnerDealer[];
  executiveHighlights: DashboardExecutiveHighlight[];
  governanceAlerts: DashboardGovernanceAlert[];
  pipeline: DashboardProposal[];
  meta?: DashboardMeta;
};

type DashboardSnapshotCollection = Record<
  DashboardTimeframe,
  DashboardSnapshotResponse
>;

const DASHBOARD_ENDPOINT = "/analytics/dashboard";
const MOCK_ENDPOINT = "/mock/dashboard-snapshot.json";
const shouldForceMock =
  process.env.NEXT_PUBLIC_DASHBOARD_API_MODE === "mock";

async function fetchMockSnapshot(timeframe: DashboardTimeframe) {
  try {
    if (typeof window === "undefined") {
      const mockModule = await import(
        "@/../public/mock/dashboard-snapshot.json"
      );
      const mockData =
        (mockModule.default ??
          mockModule) as DashboardSnapshotCollection | undefined;
      if (!mockData || !mockData[timeframe]) {
        throw new Error("Mock inválido ou timeframe inexistente.");
      }
      return mockData[timeframe];
    }

    const response = await fetch(MOCK_ENDPOINT, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Falha ao carregar mock do dashboard.");
    }

    const data = (await response.json()) as DashboardSnapshotCollection;
    return data[timeframe];
  } catch (mockError) {
    throw new Error(
      (mockError as Error)?.message ||
        "Não foi possível carregar o mock do dashboard."
    );
  }
}

const dashboardServices = {
  async getSnapshot(timeframe: DashboardTimeframe) {
    if (!shouldForceMock) {
      try {
        const { data } = await api.get<DashboardSnapshotResponse>(
          DASHBOARD_ENDPOINT,
          {
            params: { timeframe },
          }
        );

        return data;
      } catch (error) {
        console.warn(
          "[dashboardServices] Falha ao consultar API oficial, usando mock.",
          error
        );
      }
    }

    return fetchMockSnapshot(timeframe);
  },
};

export default dashboardServices;
