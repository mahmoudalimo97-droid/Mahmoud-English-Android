package com.mahmoudenglish.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.mahmoudenglish.app.model.ThemeStyle

private val SageCreamColorScheme = lightColorScheme(
    primary = Emerald800,
    onPrimary = Color.White,
    primaryContainer = Emerald100,
    onPrimaryContainer = Emerald950,
    secondary = Amber600,
    onSecondary = Color.White,
    secondaryContainer = Amber100,
    onSecondaryContainer = Amber900,
    background = SageCreamBg,
    onBackground = Stone900,
    surface = Color.White,
    onSurface = Stone900,
    surfaceVariant = Stone100,
    onSurfaceVariant = Stone700,
    outline = Stone200
)

private val WarmParchmentColorScheme = lightColorScheme(
    primary = Amber800,
    onPrimary = Color.White,
    primaryContainer = Amber100,
    onPrimaryContainer = Amber900,
    secondary = Emerald800,
    onSecondary = Color.White,
    background = WarmParchmentBg,
    onBackground = Stone900,
    surface = Color.White,
    onSurface = Stone900,
    surfaceVariant = Amber50,
    onSurfaceVariant = Stone700,
    outline = Amber100
)

private val NightForestColorScheme = darkColorScheme(
    primary = Emerald600,
    onPrimary = Color.White,
    primaryContainer = Emerald900,
    onPrimaryContainer = Emerald100,
    secondary = Amber500,
    onSecondary = Stone900,
    background = NightForestBg,
    onBackground = Stone100,
    surface = NightForestSurface,
    onSurface = Stone100,
    surfaceVariant = NightForestCard,
    onSurfaceVariant = Stone300,
    outline = Emerald900
)

@Composable
fun MahmoudEnglishTheme(
    themeStyle: ThemeStyle = ThemeStyle.SAGE_CREAM,
    content: @Composable () -> Unit
) {
    val colorScheme = when (themeStyle) {
        ThemeStyle.SAGE_CREAM -> SageCreamColorScheme
        ThemeStyle.WARM_PARCHMENT -> WarmParchmentColorScheme
        ThemeStyle.NIGHT_FOREST -> NightForestColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
