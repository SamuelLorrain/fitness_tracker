import { useState, useEffect, useRef } from "react";
import {
  CartesianGrid,
  Bar,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import { useGetStatsQuery } from "../state/api";
import { parse, format } from "date-fns";
import {
  IonToggle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { download } from "ionicons/icons";

enum StatsMode {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

enum StatsAggregateMode {
  AGGREGATE_DAILY = "aggregate_daily",
  AGGREGATE_WEEKLY = "aggregate_weekly",
  AGGREGATE_MONTHLY = "aggregate_monthly",
}

type NutritionBasicsWithDate = {
  date: Date;
  caloriesInKcal: null | number;
  carbsInKcal: null | number;
  lipidsInKcal: null | number;
  proteinsInKcal: null | number;
  waterInGrams: null | number;
  weightInKiloGrams: null | number;
};

const parseReportData = (data: Object): NutritionBasicsWithDate[] => {
  let isBegin = true;
  return Object.entries(data)
    .map<NutritionBasicsWithDate>((entries) => ({
      date: parse(entries[0], "yyyy-mm-dd", new Date()),
      caloriesInKcal: entries[1] ? entries[1]?.calories_in_kcal : null,
      carbsInKcal: entries[1] ? entries[1]?.carbs_in_grams * 4 : null,
      lipidsInKcal: entries[1] ? entries[1]?.lipids_in_grams * 9 : null,
      proteinsInKcal: entries[1] ? entries[1]?.proteins_in_grams * 4 : null,
      waterInGrams: entries[1] ? entries[1]?.water_in_grams : null,
      weightInKiloGrams: entries[1] ? entries[1]?.weight_in_kilo_grams : null,
    }))
    .filter((el) => {
      if (isBegin && el.caloriesInKcal == null) {
        return false;
      } else if (isBegin && el.caloriesInKcal != null) {
        isBegin = false;
        return true;
      }
      return true;
    });
};

const Report: React.FC = () => {
  const [statsMode, setStatsMode] = useState<StatsMode>(StatsMode.WEEKLY);
  const [aggregateMode, setAggregateMode] = useState<StatsAggregateMode>(
    StatsAggregateMode.AGGREGATE_DAILY
  );
  const { data, isLoading, isFetching, refetch } = useGetStatsQuery({
    mode: statsMode,
    aggregate: aggregateMode,
  });

  const [parsedData, setParsedData] = useState<
    NutritionBasicsWithDate[] | null
  >(null);
  const [displayWater, setDisplayWater] = useState<boolean>(false);
  const [displayCalories, setDisplayCalories] = useState<boolean>(true);
  const [displayWeight, setDisplayWeight] = useState<boolean>(true);
  const graphRef = useRef<null | HTMLDivElement>(null);
  const aggregateRef = useRef<null | HTMLIonSelectElement>(null);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isLoading === false && data != null) {
      setParsedData(parseReportData(data.fields_per_day));
      if (graphRef.current != null) {
        graphRef.current.scrollLeft = 0;
      }
    }
  }, [data, isLoading, graphRef.current]);

  const downloadData = () => {
    if (parsedData == null) {
      return;
    }
    const firstColumn =
      "date;calories in kcal;carbs in kcal;lipids in kcal;proteins in kcal;water in grams;weight in kilo grams\r\n";
    const content = parsedData
      .splice(1)
      .map(
        (e) =>
          `${format(e.date, "yyyy-mm-dd")};${e.caloriesInKcal ?? ""};${
            e.carbsInKcal ?? ""
          };${e.lipidsInKcal ?? ""};${e.proteinsInKcal ?? ""};${
            e.waterInGrams ?? ""
          };${e.weightInKiloGrams}\r\n`
      )
      .join("");
    const csv = firstColumn + content;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", "report.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Report</IonTitle>
          <IonButtons slot="end">
            <IonSelect
              aria-label="Stats mode"
              value={statsMode}
              onIonChange={(e) => {
                setStatsMode(e.detail.value);
                if (e.detail.value == StatsMode.WEEKLY) {
                  setAggregateMode(StatsAggregateMode.AGGREGATE_DAILY);
                } else if (e.detail.value == StatsMode.MONTHLY) {
                  setAggregateMode(StatsAggregateMode.AGGREGATE_WEEKLY);
                }
              }}
            >
              <IonSelectOption value={StatsMode.WEEKLY}>Weekly</IonSelectOption>
              <IonSelectOption value={StatsMode.MONTHLY}>
                Monthly
              </IonSelectOption>
            </IonSelect>
            <IonSelect
              aria-label="Aggregate"
              value={aggregateMode}
              className="hide"
              onIonChange={(e) => setAggregateMode(e.detail.value)}
              ref={aggregateRef}
            >
              <IonSelectOption value={StatsAggregateMode.AGGREGATE_DAILY}>
                Aggregate Daily
              </IonSelectOption>
              <IonSelectOption value={StatsAggregateMode.AGGREGATE_WEEKLY}>
                Aggregate Weekly
              </IonSelectOption>
              <IonSelectOption value={StatsAggregateMode.AGGREGATE_MONTHLY}>
                Aggregate Monthly
              </IonSelectOption>
            </IonSelect>
            <IonButton
              disabled={parsedData != null && parsedData?.length === 0}
              onClick={downloadData}
            >
              <IonIcon icon={download} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {parsedData && parsedData.length == 0 ? (
          <div>no data available</div>
        ) : null}
        {isLoading || (isFetching && parsedData == null) ? (
          <IonSpinner />
        ) : null}
        {parsedData && !isFetching ? (
          <>
            <div ref={graphRef} className="no-y-scrollable">
              <ComposedChart
                width={65 * parsedData.length}
                height={380}
                data={parsedData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 100,
                }}
              >
                <Tooltip />
                <Bar
                  type="monotone"
                  dataKey="carbsInKcal"
                  stackId="a"
                  fill="#0088FE"
                />
                <Bar
                  type="monotone"
                  dataKey="lipidsInKcal"
                  stackId="a"
                  fill="#FFBB28"
                />
                <Bar
                  type="monotone"
                  dataKey="proteinsInKcal"
                  stackId="a"
                  fill="#FF8042"
                />
                {displayWater ? (
                  <Line
                    animationDuration={500}
                    connectNulls
                    type="monotone"
                    dataKey="waterInGrams"
                    stroke="blue"
                    strokeWidth={2}
                  />
                ) : null}
                {displayCalories ? (
                  <Line
                    animationDuration={500}
                    connectNulls
                    type="monotone"
                    dataKey="caloriesInKcal"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                ) : null}
                {displayWeight ? (
                  <Line
                    animationDuration={500}
                    connectNulls
                    type="monotone"
                    dataKey="weightInKiloGrams"
                    stroke="#cf0000"
                    strokeWidth={3}
                  />
                ) : null}
                <XAxis
                  dataKey={(e) => format(e.date, "yyyy mm dd")}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
              </ComposedChart>
            </div>
            {parsedData && parsedData.length != 0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                }}
              >
                <IonToggle
                  checked={displayWater}
                  onIonChange={() => setDisplayWater((state) => !state)}
                >
                  Water
                </IonToggle>
                <IonToggle
                  checked={displayCalories}
                  onIonChange={() => setDisplayCalories((state) => !state)}
                >
                  Calories
                </IonToggle>
                <IonToggle
                  checked={displayWeight}
                  onIonChange={() => setDisplayWeight((state) => !state)}
                >
                  Weight
                </IonToggle>
              </div>
            ) : null}
          </>
        ) : null}
        <div className="blank-space"></div>
      </IonContent>
    </>
  );
};

export default Report;
