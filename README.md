

<div align="center">

<h1> <strong>shrymp server</strong> </h1>

**a quick and easy URL shortener.**

<!-- <img src="res/repo/banner.svg" height='300px'> -->

[![Build Status](https://travis-ci.com/songmawa/shrymp-server.svg?branch=master)](https://travis-ci.com/songmawa/pndo.me-server)
[![GitHub Issues](https://img.shields.io/github/issues/songmawa/shrymp-server.svg)](https://github.com/songmawa/pndo.me-server/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/songmawa/shrymp-server.svg)](https://github.com/songmawa/pndo.me-server/pulls)
[![GitHub License](https://img.shields.io/github/license/songmawa/shrymp-server)](/LICENSE)

</div>

## Getting Started

### Installing

#### **create and edit server config file in res/server.json**
```
vim config/server.json
```
```json
{
	"port": 3001,
	"production": false,
	"sessionKeys": [ "super-duper-secret", "even-more-secret" ]
}
```

#### **create and edit database config file in res/db.json**
```
vim config/db.json
```
```json
{
	"mongo": {
		"host": "mongo.tinysorbet.moe",
		"port": 27017,
		"database": "shrymp-dev",
		"authSource": "authDB",
		"username": "username",
		"password": "password"
	},
	"maria": {
		"host": "maria.tinysorbet.moe",
		"port": 3306,
		"database": "shrymp-dev",
		"username": "username",
		"password": "password"
	}
}
```

#### **create and edit domains config file in res/domains.json**
```
vim config/domains.json
```
```json
[ 
	"shyrmp.co",
	"shyrmp.one",
	"example.xyz"
]
```

### Compiling

**transile the source into javascript**

```
yarn build
```

### Running

**run the program**

```
yarn start
```

## Deploying

**TODO**

## Documentation

Software specifications & design documents can be found in the [wiki](/wiki).

## See Also

- **shrymp-web - https://github.com/theluckyegg/shrymp-web**

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for a in depth view.

## Credits

Please see [CREDITS.md](CREDITS.md) for a in depth view.

## License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE.md](LICENSE.md) file for details.
