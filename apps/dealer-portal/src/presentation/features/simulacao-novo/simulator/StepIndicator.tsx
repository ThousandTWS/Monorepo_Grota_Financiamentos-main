import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Operacao e veiculo" },
  { id: 2, name: "Dados pessoais" },
  { id: 3, name: "Dados profissionais" },
  { id: 4, name: "Revisao e confirmacao" },
];

type StepIndicatorProps = {
  currentStep: number;
};

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-[#134B73] to-[#1a6fa0] transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "transition-all duration-300 border-2",
                    isCompleted
                      ? "bg-[#134B73] border-[#134B73] text-white"
                      : isCurrent
                      ? "bg-white border-[#134B73] text-[#134B73] ring-4 ring-[#134B73]/20"
                      : "bg-white border-gray-300 text-gray-400",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>

                <div className="mt-3 text-center max-w-[120px]">
                  <p
                    className={[
                      "text-sm font-medium transition-colors",
                      isCompleted || isCurrent ? "text-[#134B73]" : "text-gray-400",
                    ].join(" ")}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
