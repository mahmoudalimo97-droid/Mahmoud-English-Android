package com.mahmoudenglish.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahmoudenglish.app.data.DefaultData
import com.mahmoudenglish.app.model.Lesson
import com.mahmoudenglish.app.model.QuizQuestion
import com.mahmoudenglish.app.ui.theme.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper

@Composable
fun LessonsAndQuizzesScreen(
    lessons: List<Lesson> = DefaultData.LESSONS,
    quizzes: List<QuizQuestion> = DefaultData.QUIZZES,
    tts: TextToSpeechHelper
) {
    var activeSubTab by remember { mutableStateOf("diagrams") } // "diagrams" or "quizzes"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 14.dp)
    ) {
        // Sub-tabs (Visual Diagrams vs Quizzes)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = { activeSubTab = "diagrams" },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (activeSubTab == "diagrams") Emerald800 else MaterialTheme.colorScheme.surfaceVariant
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.weight(1f)
            ) {
                Icon(imageVector = Icons.Default.Analytics, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "مخططات القواعد البصرية 📊",
                    fontSize = 12.sp,
                    color = if (activeSubTab == "diagrams") Color.White else Stone700,
                    fontWeight = FontWeight.Bold
                )
            }

            Button(
                onClick = { activeSubTab = "quizzes" },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (activeSubTab == "quizzes") Emerald800 else MaterialTheme.colorScheme.surfaceVariant
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.weight(1f)
            ) {
                Icon(imageVector = Icons.Default.Quiz, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "اختبارات تفاعلية ✍️",
                    fontSize = 12.sp,
                    color = if (activeSubTab == "quizzes") Color.White else Stone700,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        if (activeSubTab == "diagrams") {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                contentPadding = PaddingValues(bottom = 16.dp)
            ) {
                // Diagram 1: Sentence Structure (S + V + O)
                item {
                    SentenceStructureDiagramCard(tts = tts)
                }

                // Diagram 2: Present Simple S-Rule
                item {
                    PresentSimpleDiagramCard(tts = tts)
                }

                // Diagram 3: Prepositions of Place
                item {
                    PrepositionsDiagramCard(tts = tts)
                }
            }
        } else {
            // Interactive Quizzes Section
            QuizzesContent(quizzes = quizzes, tts = tts)
        }
    }
}

@Composable
fun SentenceStructureDiagramCard(tts: TextToSpeechHelper) {
    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "1. ترتيب الجملة الإنجليزية (S + V + O)",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Emerald900
                )
                IconButton(
                    onClick = { tts.speakWordWithExplanation("Subject Verb Object", "ترتيب الجملة الإنجليزية فاعل ثم فعل ثم مفعول به") },
                    modifier = Modifier.size(30.dp)
                ) {
                    Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, tint = Emerald800)
                }
            }

            Text(
                text = "على عكس العربية، الجملة في الإنجليزية يجب أن تبدأ دائماً بالفاعل!",
                fontSize = 12.sp,
                color = Stone600
            )

            // Visual Blocks (Subject -> Verb -> Object)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Block 1: Subject
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Emerald100,
                    modifier = Modifier.weight(1f)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Text(text = "Subject", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Emerald950)
                        Text(text = "الفاعل", fontSize = 10.sp, color = Emerald800)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "Ahmed", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, fontFamily = FontFamily.Serif)
                    }
                }

                Text(text = "➔", fontSize = 16.sp, color = Stone400, modifier = Modifier.padding(horizontal = 4.dp))

                // Block 2: Verb
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Amber100,
                    modifier = Modifier.weight(1f)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Text(text = "Verb", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Amber900)
                        Text(text = "الفعل", fontSize = 10.sp, color = Amber800)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "drank", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, fontFamily = FontFamily.Serif)
                    }
                }

                Text(text = "➔", fontSize = 16.sp, color = Stone400, modifier = Modifier.padding(horizontal = 4.dp))

                // Block 3: Object
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Emerald50,
                    modifier = Modifier.weight(1f)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Text(text = "Object", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Emerald900)
                        Text(text = "المفعول", fontSize = 10.sp, color = Emerald700)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "coffee", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, fontFamily = FontFamily.Serif)
                    }
                }
            }

            // Audio Sample Button
            OutlinedButton(
                onClick = { tts.speakEnglish("Ahmed drank coffee.") },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "استمع للجملة: \"Ahmed drank coffee\"", fontSize = 12.sp)
            }
        }
    }
}

@Composable
fun PresentSimpleDiagramCard(tts: TextToSpeechHelper) {
    var isSingularSelected by remember { mutableStateOf(true) }

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = "2. المضارع البسيط وقاعدة الـ S مع المفرد",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Emerald900
            )

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = isSingularSelected,
                    onClick = { isSingularSelected = true },
                    label = { Text("المفرد (He / She / It)") }
                )
                FilterChip(
                    selected = !isSingularSelected,
                    onClick = { isSingularSelected = false },
                    label = { Text("الجمع والمتكلم (I / They / We)") }
                )
            }

            Surface(
                shape = RoundedCornerShape(16.dp),
                color = if (isSingularSelected) Amber50 else Emerald50,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = if (isSingularSelected) "قاعدة المفرد: نضيف s أو es لنهاية الفعل!" else "قاعدة الجمع: الفعل يبقى في المصدر بدون أي إضافات!",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = if (isSingularSelected) Amber900 else Emerald900
                    )
                    Text(
                        text = if (isSingularSelected) "He works • She plays • It rains" else "They work • We play • I drink",
                        fontSize = 15.sp,
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            OutlinedButton(
                onClick = {
                    if (isSingularSelected) tts.speakEnglish("He works every day.")
                    else tts.speakEnglish("They work every day.")
                },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isSingularSelected) "استمع: He works every day" else "استمع: They work every day",
                    fontSize = 12.sp
                )
            }
        }
    }
}

@Composable
fun PrepositionsDiagramCard(tts: TextToSpeechHelper) {
    val preps = listOf(
        Triple("In", "في الداخل", "The keys are in the box 📦"),
        Triple("On", "على السطح", "The cup is on the table ☕"),
        Triple("Under", "تحت الشيء", "The cat is under the chair 🐱"),
        Triple("Next to", "بجانبه", "Sit next to me 🪑")
    )

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text(
                text = "3. حروف الجر المكانية (Prepositions of Place)",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Emerald900
            )

            preps.forEach { (en, ar, example) ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(text = en, fontWeight = FontWeight.Bold, fontSize = 14.sp, fontFamily = FontFamily.Serif, color = Emerald800)
                                Text(text = "($ar)", fontSize = 12.sp, color = Stone600)
                            }
                            Text(text = example, fontSize = 11.sp, color = Stone800)
                        }

                        IconButton(
                            onClick = { tts.speakEnglish(example) },
                            modifier = Modifier.size(30.dp)
                        ) {
                            Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, tint = Emerald800)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun QuizzesContent(quizzes: List<QuizQuestion>, tts: TextToSpeechHelper) {
    var currentQuestionIndex by remember { mutableStateOf(0) }
    var selectedOptionIndex by remember { mutableStateOf<Int?>(null) }
    var isSubmitted by remember { mutableStateOf(false) }
    var score by remember { mutableStateOf(0) }

    val question = quizzes[currentQuestionIndex.coerceIn(0, quizzes.lastIndex)]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Question Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "السؤال ${currentQuestionIndex + 1} من ${quizzes.size}",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Emerald800
            )
            Text(
                text = "النقاط: $score",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Amber800
            )
        }

        // Question Card
        Card(
            shape = RoundedCornerShape(22.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = question.questionAr,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                if (!question.contextEn.isNullOrBlank()) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Emerald50,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = question.contextEn,
                                fontSize = 14.sp,
                                fontFamily = FontFamily.Serif,
                                fontWeight = FontWeight.Bold
                            )
                            IconButton(onClick = { tts.speakEnglish(question.contextEn) }, modifier = Modifier.size(28.dp)) {
                                Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, tint = Emerald800)
                            }
                        }
                    }
                }

                // Options List
                question.options.forEachIndexed { idx, opt ->
                    val isSelected = selectedOptionIndex == idx
                    val isCorrect = idx == question.correctIndex

                    val bgColor = when {
                        !isSubmitted && isSelected -> Emerald100
                        isSubmitted && isCorrect -> Color(0xFFD1FAE5)
                        isSubmitted && isSelected && !isCorrect -> Color(0xFFFEE2E2)
                        else -> MaterialTheme.colorScheme.surfaceVariant
                    }

                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = bgColor,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .clickable(enabled = !isSubmitted) { selectedOptionIndex = idx }
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = opt,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            if (isSubmitted && isCorrect) {
                                Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = Emerald800)
                            } else if (isSubmitted && isSelected && !isCorrect) {
                                Icon(imageVector = Icons.Default.Cancel, contentDescription = null, tint = Color.Red)
                            }
                        }
                    }
                }

                // Explanation
                if (isSubmitted) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Stone100,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "💡 الشرح: ${question.explanationAr}",
                            fontSize = 12.sp,
                            modifier = Modifier.padding(10.dp),
                            color = Stone800
                        )
                    }
                }

                // Action Buttons (Submit / Next)
                if (!isSubmitted) {
                    Button(
                        onClick = {
                            if (selectedOptionIndex != null) {
                                isSubmitted = true
                                if (selectedOptionIndex == question.correctIndex) {
                                    score += 10
                                    tts.playUiSound("success")
                                } else {
                                    tts.playUiSound("pop")
                                }
                            }
                        },
                        enabled = selectedOptionIndex != null,
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(text = "تأكيد الإجابة", fontWeight = FontWeight.Bold)
                    }
                } else {
                    Button(
                        onClick = {
                            if (currentQuestionIndex < quizzes.lastIndex) {
                                currentQuestionIndex++
                                selectedOptionIndex = null
                                isSubmitted = false
                            } else {
                                // Restart
                                currentQuestionIndex = 0
                                selectedOptionIndex = null
                                isSubmitted = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = if (currentQuestionIndex < quizzes.lastIndex) "السؤال التالي ➔" else "إعادة الاختبار 🔄",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
