import { ConnectionStatus } from "@/types/stock";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  status: ConnectionStatus;
  className?: string;
  animationType?: "pulse" | "breathing" | "glow" | "ripple";
}

export function ConnectionStatusIndicator({
  status,
  className,
  animationType = "breathing", // デフォルトは呼吸アニメーション
}: ConnectionStatusProps) {
  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return {
          color: "bg-emerald-500",
          text: "接続中",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          pulse: false,
        };
      case "connecting":
        return {
          color: "bg-yellow-500",
          text: "接続中...",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          pulse: true,
        };
      case "error":
        return {
          color: "bg-red-500",
          text: "エラー",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          pulse: true,
        };
      default:
        return {
          color: "bg-gray-400",
          text: "未接続",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          pulse: false,
        };
    }
  };

  const config = getStatusConfig(status);

  // アニメーションスタイルを定義
  const animationStyles = {
    pulse: "animate-pulse",
    breathing: "", // カスタムCSSで定義
    glow: "", // カスタムCSSで定義
    ripple: "", // カスタムCSSで定義
  };

  return (
    <>
      <div
        className={cn(
          "inline-flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300",
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        {/* Status indicator dot with animations */}
        <div className="relative">
          {/* メインのドット */}
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 relative z-10",
              config.color,
              status === "connected" &&
                animationType === "pulse" &&
                animationStyles.pulse,
              status === "connected" &&
                animationType === "breathing" &&
                "animate-breathing",
              status === "connected" &&
                animationType === "glow" &&
                "animate-glow"
            )}
          />

          {/* Connecting時のパルス */}
          {config.pulse && status !== "connected" && (
            <div
              className={cn(
                "absolute inset-0 w-3 h-3 rounded-full animate-ping",
                config.color,
                "opacity-50"
              )}
            />
          )}

          {/* Connected時のリップル効果 */}
          {status === "connected" && animationType === "ripple" && (
            <>
              <div
                className={cn(
                  "absolute inset-0 w-3 h-3 rounded-full animate-ripple",
                  config.color,
                  "opacity-75"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 w-3 h-3 rounded-full animate-ripple",
                  config.color,
                  "opacity-50"
                )}
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}

          {/* Connected時のソフトグロー効果 */}
          {status === "connected" && (
            <div
              className={cn(
                "absolute inset-0 w-3 h-3 rounded-full",
                config.color,
                "opacity-30 blur-sm animate-pulse"
              )}
            />
          )}
        </div>

        {/* Status text */}
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            config.textColor
          )}
        >
          {config.text}
        </span>

        {/* Connection wave animation */}
        {status === "connected" && (
          <div className="flex space-x-1">
            <div
              className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}
      </div>
    </>
  );
}
