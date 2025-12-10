import LogistasFeature from "@/presentation/features/logista";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from
    "@/presentation/layout/components/ui/card";

export default function LogistasPage() {
    return (
        <div className="py-6 space-y-6" data-oid="z7k-xqo">
            <div className="flex flex-col gap-2" data-oid="elop5yj">
                <h1 className="text-3xl font-bold tracking-tight" data-oid=":n:ayd-">
                    Gerencie os logistas cadastrados no sistema
                </h1>

            </div>

            <Card className="w-full" data-oid="m7kc9vb">
                <CardHeader data-oid="k5rh.j:">
                    <CardTitle data-oid="lygwwoh">Lista de Logistas</CardTitle>
                    <CardDescription data-oid="wyez2pf">
                        Visualize, busque e gerencie todos os logistas cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="mfks_yz">
                    <LogistasFeature data-oid="u6nusvc" />
                </CardContent>
            </Card>
        </div>
    )
}
