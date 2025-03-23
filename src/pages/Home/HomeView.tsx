import { StatisticsView } from "../Statistics/StatisticsView";
import { DataTableView } from "../Statistics/DataTableView";

export default function HomeView() {




    return (
        <div className="flex flex-col gap-4 p-3">
            <br />
            <br />
            <StatisticsView/>
            <br />
            <DataTableView/>
        </div>

    )
}