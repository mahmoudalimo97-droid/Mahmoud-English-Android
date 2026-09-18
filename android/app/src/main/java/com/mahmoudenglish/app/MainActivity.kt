package com.mahmoudenglish.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.mahmoudenglish.app.ui.components.AppHeader
import com.mahmoudenglish.app.ui.components.BottomNavBar
import com.mahmoudenglish.app.ui.components.MemoryBackupDialog
import com.mahmoudenglish.app.ui.screens.*
import com.mahmoudenglish.app.ui.theme.MahmoudEnglishTheme
import com.mahmoudenglish.app.viewmodel.MahmoudEnglishViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MahmoudEnglishViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            val theme by viewModel.theme.collectAsState()
            val currentTab by viewModel.currentTab.collectAsState()
            val progress by viewModel.progress.collectAsState()
            val isVoiceAssistActive by viewModel.isVoiceAssistActive.collectAsState()
            val vocabulary by viewModel.vocabulary.collectAsState()
            val currentScan by viewModel.currentScan.collectAsState()
            val isScanning by viewModel.isScanning.collectAsState()
            val chatMessages by viewModel.chatMessages.collectAsState()
            val isChatLoading by viewModel.isChatLoading.collectAsState()
            val isMemoryModalOpen by viewModel.isMemoryModalOpen.collectAsState()

            // RTL Layout for natural Arabic reading and interface
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                MahmoudEnglishTheme(themeStyle = theme) {
                    Scaffold(
                        topBar = {
                            AppHeader(
                                theme = theme,
                                onThemeChange = { viewModel.setTheme(it) },
                                progress = progress,
                                isVoiceAssistActive = isVoiceAssistActive,
                                onToggleVoiceAssist = { viewModel.toggleVoiceAssist() },
                                onOpenMemoryModal = { viewModel.setMemoryModalOpen(true) },
                                onLogoWelcomeSpeech = {
                                    viewModel.tts.playUiSound("chime")
                                    viewModel.tts.speakWordWithExplanation(
                                        "Welcome to Mahmoud English",
                                        "أهلاً بك في تطبيق محمود لتعلم الإنجليزية الناطق والمصور"
                                    )
                                }
                            )
                        },
                        bottomBar = {
                            BottomNavBar(
                                currentTab = currentTab,
                                onTabSelected = { viewModel.selectTab(it) }
                            )
                        },
                        containerColor = MaterialTheme.colorScheme.background
                    ) { paddingValues ->
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(paddingValues)
                        ) {
                            AnimatedContent(
                                targetState = currentTab,
                                transitionSpec = {
                                    fadeIn() togetherWith fadeOut()
                                },
                                label = "ScreenTransition"
                            ) { targetScreen ->
                                when (targetScreen) {
                                    "home" -> HomeScreen(
                                        progress = progress,
                                        totalWords = vocabulary.size,
                                        featuredWord = vocabulary.firstOrNull(),
                                        onNavigate = { viewModel.selectTab(it) },
                                        tts = viewModel.tts
                                    )
                                    "islamic" -> IslamicCornerScreen(
                                        tts = viewModel.tts,
                                        onBack = { viewModel.selectTab("home") }
                                    )
                                    "contact" -> ContactScreen()
                                    "camera" -> CameraTranslatorScreen(
                                        scanResult = currentScan,
                                        isScanning = isScanning,
                                        onCaptureClick = { viewModel.simulateCameraCapture() },
                                        onSaveWord = { viewModel.addWordToVocab(it) },
                                        tts = viewModel.tts
                                    )
                                    "vocab" -> SpeakingVocabScreen(
                                        words = vocabulary,
                                        onToggleFavorite = { viewModel.toggleFavoriteWord(it) },
                                        onDeleteWord = { viewModel.deleteWord(it) },
                                        tts = viewModel.tts
                                    )
                                    "chat" -> ChatTutorScreen(
                                        messages = chatMessages,
                                        isLoading = isChatLoading,
                                        onSendMessage = { viewModel.sendChatMessage(it) },
                                        tts = viewModel.tts
                                    )
                                    "lessons" -> LessonsAndQuizzesScreen(
                                        tts = viewModel.tts
                                    )
                                    "game" -> EducationalGameScreen(
                                        highScore = progress.gameHighScore,
                                        onUpdateHighScore = { viewModel.updateHighScore(it) },
                                        tts = viewModel.tts
                                    )
                                    "tips" -> ArabicTipsScreen(
                                        tts = viewModel.tts
                                    )
                                }
                            }
                        }

                        // Memory & Backup Dialog
                        MemoryBackupDialog(
                            isOpen = isMemoryModalOpen,
                            progress = progress,
                            wordsCount = vocabulary.size,
                            onDismiss = { viewModel.setMemoryModalOpen(false) },
                            onResetAll = { viewModel.resetAllData() }
                        )
                    }
                }
            }
        }
    }
}
