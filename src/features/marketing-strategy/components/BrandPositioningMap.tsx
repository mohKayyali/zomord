import { Box, Stack, Typography, alpha } from "@mui/material";
import { type BrandPositioningMap as BrandPositioningMapData } from "../lib/buildMarketingStrategyPreview";

type BrandPositioningMapProps = {
  businessName: string;
  positioningMap: BrandPositioningMapData;
};

export function BrandPositioningMap({
  businessName,
  positioningMap,
}: BrandPositioningMapProps) {
  const markerLeft = `${((positioningMap.horizontalScore + 100) / 200) * 100}%`;
  const markerTop = `${((100 - positioningMap.verticalScore) / 200) * 100}%`;

  return (
    <Stack spacing={1.75}>
      <Box
        sx={{
          p: 2,
          borderRadius: "28px",
          bgcolor: alpha("#ffffff", 0.62),
          border: `1px solid ${alpha("#046A38", 0.12)}`,
        }}
      >
        <Box
          sx={{
            position: "relative",
            aspectRatio: "1 / 1",
            minHeight: { xs: 280, md: 320 },
            borderRadius: "24px",
            overflow: "hidden",
            background: `
              linear-gradient(90deg, ${alpha("#A8E6CF", 0.16)} 0%, ${alpha("#ffffff", 0.08)} 50%, ${alpha("#D4AF37", 0.14)} 100%),
              linear-gradient(180deg, ${alpha("#046A38", 0.08)} 0%, ${alpha("#ffffff", 0.04)} 50%, ${alpha("#0F8F73", 0.08)} 100%)
            `,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(${alpha("#046A38", 0.05)} 1px, transparent 1px),
                linear-gradient(90deg, ${alpha("#046A38", 0.05)} 1px, transparent 1px)
              `,
              backgroundSize: "25% 25%",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1.5,
              bgcolor: alpha("#046A38", 0.22),
              transform: "translateX(-50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1.5,
              bgcolor: alpha("#046A38", 0.22),
              transform: "translateY(-50%)",
            }}
          />

          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: alpha("#143626", 0.72),
              fontWeight: 700,
            }}
          >
            {positioningMap.horizontalLabels.start}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: alpha("#143626", 0.72),
              fontWeight: 700,
            }}
          >
            {positioningMap.horizontalLabels.end}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              color: alpha("#143626", 0.72),
              fontWeight: 700,
            }}
          >
            {positioningMap.verticalLabels.start}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              color: alpha("#143626", 0.72),
              fontWeight: 700,
            }}
          >
            {positioningMap.verticalLabels.end}
          </Typography>

          <Box
            sx={{
              position: "absolute",
              left: markerLeft,
              top: markerTop,
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <Stack spacing={0.75} alignItems="center">
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: 999,
                  bgcolor: alpha("#ffffff", 0.88),
                  border: `1px solid ${alpha("#046A38", 0.14)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#143626",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {businessName}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: "#046A38",
                  border: `4px solid ${alpha("#D4AF37", 0.8)}`,
                  boxShadow: `0 0 0 8px ${alpha("#A8E6CF", 0.24)}`,
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          px: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#046A38", fontWeight: 700, mb: 0.5 }}
        >
          {positioningMap.summary}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha("#143626", 0.72), lineHeight: 1.75 }}
        >
          {positioningMap.explanation}
        </Typography>
      </Box>
    </Stack>
  );
}
