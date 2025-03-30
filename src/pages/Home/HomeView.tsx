import LightsBackground from "@/LightsBackground";
import { ServicesCardView } from "../Services/ServicesCardView";
import { StatisticsView } from "../Statistics/StatisticsView";
import '@/pages/Login/LoginView.css'

export default function HomeView() {




    return (
        <>
          <LightsBackground children={undefined}/>
            <div className="flex flex-col gap-4 p-3">
                <ServicesCardView/>
                <br />
                <StatisticsView />
                {/* <DataTableView /> */}
            </div>
        </>


    )
}