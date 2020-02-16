package com.openland.react.animations

import android.util.Log
import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser

class RNOAnimationTransactionSpec {
    var transactionKey: String? = null
    var duration: Float = 0.3f
    var animations = mutableListOf<RNOAnimationSpec>()
    var valueSets = mutableListOf<RNOValueSet>()
}

enum class RNOAnimationType {
    timing,
    circular
}

enum class RNOEasingType {
    material,
    linear,
    bezier
}

class RNOEasing {
    var type: RNOEasingType = RNOEasingType.linear
    var bezier: Array<Float>? = null
}

class RNOAnimationSpec {
    var type: RNOAnimationType = RNOAnimationType.timing
    var easing: RNOEasing = RNOEasing()
    var viewKey: String = ""
    var property: String = ""
    var to: Float = 0.0f
    var from: Float = 0.0f

    var centerX: Float = 0.0f
    var centerY: Float = 0.0f

    var duration: Float? = null
    var optional: Boolean = false
}

class RNOValueSet {
    var viewKey: String = ""
    var property: String = ""
    var value: Float = 0.0f
    var optional: Boolean = false
}

fun parseAnimationSpec(spec: String): RNOAnimationTransactionSpec {
    val res = RNOAnimationTransactionSpec()
    val parser = Parser()
    val parsed = parser.parse(StringBuilder(spec)) as JsonObject
    if (parsed["duration"] is Number) {
        res.duration = (parsed["duration"] as Number).toFloat()
    }
    if (parsed["transactionKey"] is String) {
        res.transactionKey = parsed["transactionKey"] as String
    }
    for (anim in parsed["animations"] as JsonArray<JsonObject>) {
        val aspec = RNOAnimationSpec()
        when (anim["type"] as String) {
            "spring" -> {
                Log.d("RNOAnimated", "Spring animations are not supported on Android")
            }
            "timing" -> aspec.type = RNOAnimationType.timing
            "circular" -> {
                aspec.type = RNOAnimationType.circular
            }
        }

        aspec.viewKey = anim["view"] as String
        aspec.to = (anim["to"] as Number).toFloat()
        aspec.from = (anim["from"] as Number).toFloat()

        // Property
        if (aspec.type != RNOAnimationType.circular) {
            aspec.property = anim["prop"] as String
        }

        // Easing
        if (anim["easing"] is JsonObject) {
            val eas = anim["easing"] as JsonObject
            when(eas["type"] as String) {
                "linear" -> aspec.easing = RNOEasing().apply { type = RNOEasingType.linear }
                "material" -> aspec.easing = RNOEasing().apply { type = RNOEasingType.material }
                "bezier" -> aspec.easing = RNOEasing().apply { type = RNOEasingType.bezier; bezier = (eas["bezier"] as JsonArray<Number>).map { it.toFloat() }.toTypedArray() }
            }
        }

        // Duration
        if (anim["duration"] is Number) {
            aspec.duration = (anim["duration"] as Number).toFloat()
        }

        if (anim["centerX"] is Number) {
            aspec.centerX = (anim["centerX"] as Number).toFloat()
        }
        if (anim["centerY"] is Number) {
            aspec.centerY = (anim["centerY"] as Number).toFloat()
        }

        // Optional
        if (anim["optional"] is Boolean) {
            aspec.optional = anim["optional"] as Boolean
        }

        res.animations.add(aspec)
    }
    for (setter in parsed["valueSetters"] as JsonArray<JsonObject>) {
        val aspec = RNOValueSet()
        aspec.viewKey = setter["view"] as String
        aspec.property = setter["prop"] as String
        aspec.value = (setter["to"] as Number).toFloat()
        if (setter["optional"] is Boolean) {
            aspec.optional = setter["optional"] as Boolean
        }
        res.valueSets.add(aspec)
    }
    return res
}