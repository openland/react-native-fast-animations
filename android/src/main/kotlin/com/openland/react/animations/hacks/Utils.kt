package com.openland.react.animations.hacks

import android.os.Handler
import android.os.Looper

private val handler = Handler(Looper.getMainLooper())

fun runOnUIThreadDelayed(delay: Int, callback: () -> Unit) {
    handler.postDelayed(callback, delay.toLong())
}

fun runOnUIThread(callback: () -> Unit) {
    handler.post(callback)
}