package com.mahmoudenglish.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mahmoudenglish.app.data.DefaultData
import com.mahmoudenglish.app.model.GameQuestion
import com.mahmoudenglish.app.ui.theme.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper
import kotlinx.coroutines.delay

@Composable
fun EducationalGameScreen(
    questions: List<GameQuestion> = DefaultData.GAME_QUESTIONS,
    highScore: Int,
    onUpdateHighScore: (Int) -> Unit,
    tts: TextToSpeechHelper
) {
    var gameMode by remember { mutableStateOf("match") } // "match", "audio", "puzzle"
    var currentIndex by remember { mutableStateOf(0) }
    var score by remember { mutableStateOf(0) }
    var streak by remember { mutableStateOf(0) }
    var selectedOption by remember { mutableStateOf<Int?>(null) }
    var isAnswered by remember { mutableStateOf(false) }
    var timeLeft by remember { mutableStateOf(10) }

    val currentQ = questions[currentIndex.coerceIn(0, questions.lastIndex)]

    // Countdown timer
    LaunchedEffect(currentIndex, isAnswered) {
        if (!isAnswered) {
            timeLeft = 10
            while (timeLeft > 0 && !isAnswered) {
                delay(1000)
                timeLeft--
            }
            if (timeLeft == 0 && !isAnswered) {
                isAnswered = true
                selectedOption = -1
                streak = 0
                tts.playUiSound("pop")
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Game Header: Score, Streak, Timer
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(shape = RoundedCornerShape(12.dp), color = Emerald100) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(imageVector = Icons.Default.Stars, contentDescription = null, tint = Emerald800, modifier = Modifier.size(16.dp))
                    Text(text = "$score نقطة", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Emerald950)
                }
            }

            Surface(shape = RoundedCornerShape(12.dp), color = Amber100) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(imageVector = Icons.Default.LocalFireDepartment, contentDescription = null, tint = Amber800, modifier = Modifier.size(16.dp))
                    Text(text = "Streak x$streak", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Amber900)
                }
            }

            // Countdown Pill
            Surface(
                shape = CircleShape,
                color = if (timeLeft <= 3) Color(0xFFFEE2E2) else Emerald50
            ) {
                Text(
                    text = "${timeLeft}s ⏱️",
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = if (timeLeft <= 3) Color.Red else Emerald800,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                )
            }
        }

        // Mode Switcher Pills
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf(
                Triple("match", "مطابقة الصور", Icons.Default.Image),
                Triple("audio", "تحدي الاستماع", Icons.Default.Hearing),
                Triple("puzzle", "لغز الحروف", Icons.Default.Extension)
            ).forEach { (mode, label, icon) ->
                val isSelected = gameMode == mode
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isSelected) Emerald800 else MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .clickable {
                            gameMode = mode
                            isAnswered = false
                            selectedOption = null
                        }
                ) {
                    Row(
                        modifier = Modifier.padding(vertical = 6.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            tint = if (isSelected) Color.White else Stone600,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = label,
                            fontSize = 10.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) Color.White else Stone600
                        )
                    }
                }
            }
        }

        // Question Display Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (gameMode != "audio") {
                    if (!currentQ.imageUrl.isNullOrBlank()) {
                        AsyncImage(
                            model = currentQ.imageUrl,
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(110.dp)
                                .clip(RoundedCornerShape(18.dp))
                        )
                    }
                    Text(
                        text = currentQ.word,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif
                    )
                } else {
                    // Audio Mode Card
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(Emerald100)
                            .clickable { tts.speakEnglish(currentQ.word) },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.VolumeUp,
                            contentDescription = "استماع",
                            tint = Emerald800,
                            modifier = Modifier.size(44.dp)
                        )
                    }
                    Text(
                        text = "اضغط على الأيقونة للاستماع للكلمة بالإنجليزية 🎧",
                        fontSize = 12.sp,
                        color = Stone600
                    )
                }

                if (gameMode == "puzzle" && currentQ.missingWordPuzzle != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Amber50,
                        modifier = Modifier.padding(vertical = 4.dp)
                    ) {
                        Text(
                            text = currentQ.missingWordPuzzle.template,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif,
                            color = Amber900,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                        )
                    }
                }

                // Options (Choices)
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    currentQ.options.forEachIndexed { index, option ->
                        val isCorrect = index == currentQ.correctIndex
                        val isChosen = selectedOption == index

                        val btnColor = when {
                            !isAnswered -> MaterialTheme.colorScheme.surfaceVariant
                            isCorrect -> Color(0xFFD1FAE5)
                            isChosen && !isCorrect -> Color(0xFFFEE2E2)
                            else -> MaterialTheme.colorScheme.surfaceVariant
                        }

                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = btnColor,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .clickable(enabled = !isAnswered) {
                                    selectedOption = index
                                    isAnswered = true
                                    if (isCorrect) {
                                        score += (10 + streak * 2)
                                        streak++
                                        onUpdateHighScore(score)
                                        tts.playUiSound("success")
                                    } else {
                                        streak = 0
                                        tts.playUiSound("pop")
                                    }
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = option,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                if (isAnswered && isCorrect) {
                                    Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Emerald800)
                                }
                            }
                        }
                    }
                }

                if (isAnswered) {
                    Button(
                        onClick = {
                            if (currentIndex < questions.lastIndex) {
                                currentIndex++
                            } else {
                                currentIndex = 0
                            }
                            isAnswered = false
                            selectedOption = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(text = "السؤال التالي ➔", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
