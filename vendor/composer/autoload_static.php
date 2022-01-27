<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit8b62235ca4cf428b0b20ace0b6675a09
{
    public static $prefixLengthsPsr4 = array (
        'U' => 
        array (
            'UniFi_API\\' => 10,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'UniFi_API\\' => 
        array (
            0 => __DIR__ . '/..' . '/art-of-wifi/unifi-api-client/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit8b62235ca4cf428b0b20ace0b6675a09::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit8b62235ca4cf428b0b20ace0b6675a09::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit8b62235ca4cf428b0b20ace0b6675a09::$classMap;

        }, null, ClassLoader::class);
    }
}