package bootstrap

import "go.uber.org/zap"

func NewLogger(env string) *zap.Logger {
	var l *zap.Logger
	var err error
	if env == "production" {
		l, err = zap.NewProduction()
	} else {
		l, err = zap.NewDevelopment()
	}
	if err != nil {
		panic(err)
	}
	return l
}
